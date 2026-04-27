import transactionModel from "../models/transaction.model.js";
import accountModel from "../models/account.model.js";
import ledgerModel from "../models/ledger.model.js";
import {
  sendMoneySentEmail,
  sendMoneyReceivedEmail,
  sendFailedTransactionNotification,
} from "../services/email.service.js";
import mongoose from "mongoose";

// Create a new transaction
async function createTransactionController(req, res) {
  let session;
  try {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    const userId = req.user._id;

    // Step 1: Validate request
    if (!fromAccount || !toAccount || !amount) {
      return res.status(400).json({
        status: "failed",
        message: "fromAccount, toAccount and amount are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Amount must be greater than 0",
      });
    }

    if (fromAccount === toAccount) {
      return res.status(400).json({
        status: "failed",
        message: "fromAccount and toAccount cannot be the same",
      });
    }

    // Step 2: Validate idempotency key
    if (
      !idempotencyKey ||
      typeof idempotencyKey !== "string" ||
      !idempotencyKey.trim()
    ) {
      return res.status(400).json({
        status: "failed",
        message: "idempotencyKey is required and must be a non-empty string",
      });
    }

    const finalIdempotencyKey = idempotencyKey.trim();

    // Verify from account belongs to authenticated user
    const fromAccountDoc = await accountModel.findById(fromAccount);
    if (!fromAccountDoc) {
      return res.status(404).json({
        status: "failed",
        message: "From account not found",
      });
    }

    if (fromAccountDoc.user.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized to create transaction from this account",
      });
    }

    if (fromAccountDoc.status !== "ACTIVE") {
      return res.status(400).json({
        status: "failed",
        message: "From account is not active",
      });
    }

    // Verify destination account exists
    const toAccountDoc = await accountModel
      .findById(toAccount)
      .populate("user", "email firstName lastName");
    if (!toAccountDoc) {
      return res.status(404).json({
        status: "failed",
        message: "To account not found",
      });
    }

    if (toAccountDoc.status !== "ACTIVE") {
      return res.status(400).json({
        status: "failed",
        message: "To account is not active",
      });
    }

    // Step 3: Check account status (from and to accounts are ACTIVE)
    // Already validated above with fromAccountDoc.status and toAccountDoc.status checks

    // Step 2 (continued): Idempotency check
    const existingTransaction = await transactionModel.findOne({
      idempotencyKey: finalIdempotencyKey,
    });

    if (existingTransaction) {
      return res.status(200).json({
        status: "success",
        message: "Transaction already exists for this idempotency key",
        transaction: existingTransaction,
      });
    }

    // Step 4: Derive sender balance from ledger
    const senderLedgerAggregation = await ledgerModel.aggregate([
      {
        $match: {
          account: new mongoose.Types.ObjectId(fromAccount),
        },
      },
      {
        $group: {
          _id: "$account",
          totalDebits: {
            $sum: {
              $cond: [{ $eq: ["$direction", "DEBIT"] }, "$amount", 0],
            },
          },
          totalCredits: {
            $sum: {
              $cond: [{ $eq: ["$direction", "CREDIT"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          balance: { $subtract: ["$totalCredits", "$totalDebits"] },
        },
      },
    ]);

    const derivedSenderBalance = senderLedgerAggregation[0]?.balance ?? 0;

    if (Number(amount) > derivedSenderBalance) {
      return res.status(400).json({
        status: "failed",
        message: "Insufficient sender balance",
        balance: derivedSenderBalance,
      });
    }

    session = await mongoose.startSession();

    let transaction;

    // Step 9: Commit MongoDB session
    await session.withTransaction(async () => {
      // Step 5: Create transaction (PENDING)
      transaction = await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount: Number(amount),
            status: "PENDING",
            idempotencyKey: finalIdempotencyKey,
          },
        ],
        { session },
      );

      const createdTransaction = transaction[0];

      // Step 6: Create DEBIT ledger entry
      await ledgerModel.create(
        [
          {
            account: fromAccount,
            transaction: createdTransaction._id,
            direction: "DEBIT",
            amount: Number(amount),
            currency: fromAccountDoc.currency,
            note: "Transfer sent",
          },
        ],
        { session },
      );

      // Step 7: Create CREDIT ledger entry
      await ledgerModel.create(
        [
          {
            account: toAccount,
            transaction: createdTransaction._id,
            direction: "CREDIT",
            amount: Number(amount),
            currency: toAccountDoc.currency,
            note: "Transfer received",
          },
        ],
        { session },
      );

      // Step 8: Mark transaction COMPLETED
      createdTransaction.status = "COMPLETED";
      await createdTransaction.save({ session });
    });

    const createdTransactionId = transaction[0]?._id;

    const populatedTransaction = await transactionModel
      .findById(createdTransactionId)
      .populate([
        {
          path: "fromAccount",
          populate: { path: "user", select: "email firstName lastName" },
        },
        {
          path: "toAccount",
          populate: { path: "user", select: "email firstName lastName" },
        },
      ]);

    // Step 10: Send sender/receiver email notifications (non-blocking)
    try {
      const senderName = [req.user.firstName, req.user.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      await sendMoneySentEmail({
        to: req.user.email,
        senderName: senderName || req.user.email,
        recipientName:
          [toAccountDoc.user?.firstName, toAccountDoc.user?.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() || toAccountDoc.user?.email,
        recipientEmail: toAccountDoc.user?.email,
        transactionId: populatedTransaction._id,
        amount: populatedTransaction.amount,
        currency: fromAccountDoc.currency,
      });

      if (toAccountDoc.user?.email) {
        await sendMoneyReceivedEmail({
          to: toAccountDoc.user.email,
          recipientName:
            [toAccountDoc.user?.firstName, toAccountDoc.user?.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() || toAccountDoc.user.email,
          senderName: senderName || req.user.email,
          senderEmail: req.user.email,
          transactionId: populatedTransaction._id,
          amount: populatedTransaction.amount,
          currency: toAccountDoc.currency,
        });
      }
    } catch (emailError) {
      console.warn(
        "Transaction created but notification email failed:",
        emailError.message,
      );
    }

    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      transaction: populatedTransaction,
    });
  } catch (error) {
    console.error("Create Transaction Error:", error);

    // Send failed transaction notification
    if (req.user?.email) {
      try {
        await sendFailedTransactionNotification({
          to: req.user.email,
          transactionId: null,
          amount: req.body.amount || 0,
          currency: "INR",
          reason: error.message || "Transaction processing failed",
        });
      } catch (emailError) {
        console.warn(
          "Failed transaction notification email could not be sent:",
          emailError.message,
        );
      }
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        status: "failed",
        message: "Duplicate idempotency key",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}

// Get all transactions for authenticated user
async function getUserTransactionsController(req, res) {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const userAccounts = await accountModel
      .find({ user: userId })
      .select("_id");
    const accountIds = userAccounts.map((acc) => acc._id);

    if (accountIds.length === 0) {
      return res.status(200).json({
        status: "success",
        count: 0,
        transactions: [],
      });
    }

    const filters = {
      $or: [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } },
      ],
    };

    if (status) {
      filters.status = status;
    }

    const transactions = await transactionModel
      .find(filters)
      .populate("fromAccount", "currency status user")
      .populate("toAccount", "currency status user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get User Transactions Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get transaction by id
async function getTransactionByIdController(req, res) {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    const transaction = await transactionModel
      .findById(transactionId)
      .populate("fromAccount", "currency status user")
      .populate("toAccount", "currency status user");

    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction not found",
      });
    }

    const canAccess =
      transaction.fromAccount?.user?.toString() === userId.toString() ||
      transaction.toAccount?.user?.toString() === userId.toString();

    if (!canAccess) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized access to this transaction",
      });
    }

    res.status(200).json({
      status: "success",
      transaction,
    });
  } catch (error) {
    console.error("Get Transaction By Id Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Update transaction status
async function updateTransactionStatusController(req, res) {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (!["PENDING", "COMPLETED", "FAILED", "REVERSED"].includes(status)) {
      return res.status(400).json({
        status: "failed",
        message:
          "Invalid status. Must be PENDING, COMPLETED, FAILED or REVERSED",
      });
    }

    const transaction = await transactionModel
      .findById(transactionId)
      .populate("fromAccount", "user");

    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction not found",
      });
    }

    // Only owner of source account can update status
    if (transaction.fromAccount?.user?.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized to update this transaction",
      });
    }

    transaction.status = status;
    await transaction.save();

    const updatedTransaction = await transaction.populate([
      {
        path: "fromAccount",
        select: "currency status user",
        populate: { path: "user", select: "email" },
      },
      { path: "toAccount", select: "currency status user" },
    ]);

    // Send failed transaction notification if status is FAILED
    if (status === "FAILED" && updatedTransaction.fromAccount?.user?.email) {
      await sendFailedTransactionNotification({
        to: updatedTransaction.fromAccount.user.email,
        transactionId: updatedTransaction._id,
        amount: updatedTransaction.amount,
        currency: updatedTransaction.fromAccount.currency,
        reason: "Transaction was marked as failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Transaction status updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Update Transaction Status Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

export {
  createTransactionController,
  getUserTransactionsController,
  getTransactionByIdController,
  updateTransactionStatusController,
};
