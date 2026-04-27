import accountModel from "../models/account.model.js";
import userModel from "../models/user.model.js";
import ledgerModel from "../models/ledger.model.js";
import transactionModel from "../models/transaction.model.js";
import mongoose from "mongoose";

const WELCOME_BONUS_AMOUNT = 10000;

async function getAccountBalance(accountId, session = null) {
  const pipeline = [
    {
      $match: {
        account: new mongoose.Types.ObjectId(accountId),
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
  ];

  const [result] = await ledgerModel.aggregate(pipeline).session(session);
  return Number(result?.balance ?? 0);
}

async function ensurePlatformFundingAccount(currency = "INR", session) {
  let systemUser = await userModel
    .findOne({ isSystemUser: true })
    .session(session);

  if (!systemUser) {
    systemUser = await userModel
      .create(
        [
          {
            clerkId: "__system__royal_mint__",
            email: "system@royalmint.local",
            firstName: "Royal",
            lastName: "Mint System",
            isSystemUser: true,
          },
        ],
        { session },
      )
      .then((docs) => docs[0]);
  }

  let fundingAccount = await accountModel
    .findOne({ user: systemUser._id, currency, status: "ACTIVE" })
    .session(session);

  if (!fundingAccount) {
    fundingAccount = await accountModel
      .create(
        [
          {
            user: systemUser._id,
            currency,
            status: "ACTIVE",
          },
        ],
        { session },
      )
      .then((docs) => docs[0]);
  }

  const fundingBalance = await getAccountBalance(fundingAccount._id, session);
  if (fundingBalance < WELCOME_BONUS_AMOUNT) {
    const topupAmount = WELCOME_BONUS_AMOUNT - fundingBalance;
    const bootstrapTxn = await transactionModel
      .create(
        [
          {
            fromAccount: fundingAccount._id,
            toAccount: fundingAccount._id,
            amount: topupAmount,
            status: "COMPLETED",
            idempotencyKey: `SYSTEM_TOPUP_${fundingAccount._id}_${Date.now()}`,
          },
        ],
        { session },
      )
      .then((docs) => docs[0]);

    await ledgerModel.create(
      [
        {
          account: fundingAccount._id,
          transaction: bootstrapTxn._id,
          direction: "CREDIT",
          amount: topupAmount,
          currency,
          note: "System reserve top-up",
        },
      ],
      { session },
    );
  }

  return fundingAccount;
}

// Create new account for user
async function createAccountController(req, res) {
  let session;
  try {
    const { currency = "INR", status = "ACTIVE" } = req.body;
    const userId = req.user._id; // From auth middleware

    console.log("Creating account for user:", userId, { currency, status });

    session = await mongoose.startSession();
    let account;
    let welcomeTransaction;

    await session.withTransaction(async () => {
      // Create new account (users can have multiple accounts)
      account = await accountModel
        .create(
          [
            {
              user: userId,
              currency,
              status,
            },
          ],
          { session },
        )
        .then((docs) => docs[0]);

      const fundingAccount = await ensurePlatformFundingAccount(
        currency,
        session,
      );

      // Record the onboarding bonus as a real transaction + ledger pair
      welcomeTransaction = await transactionModel
        .create(
          [
            {
              fromAccount: fundingAccount._id,
              toAccount: account._id,
              amount: WELCOME_BONUS_AMOUNT,
              status: "COMPLETED",
              idempotencyKey: `WELCOME_BONUS_${account._id}`,
            },
          ],
          { session },
        )
        .then((docs) => docs[0]);

      await ledgerModel.create(
        [
          {
            account: fundingAccount._id,
            transaction: welcomeTransaction._id,
            direction: "DEBIT",
            amount: WELCOME_BONUS_AMOUNT,
            currency,
            note: "Welcome bonus disbursed",
          },
          {
            account: account._id,
            transaction: welcomeTransaction._id,
            direction: "CREDIT",
            amount: WELCOME_BONUS_AMOUNT,
            currency,
            note: "Welcome bonus credited (INR 10,000)",
          },
        ],
        { session, ordered: true },
      );
    });

    // Populate user details
    const populatedAccount = await account.populate(
      "user",
      "email firstName lastName profileImage",
    );

    console.log("Account created successfully:", account._id);

    res.status(201).json({
      status: "success",
      message: "Account created successfully with welcome bonus",
      account: populatedAccount,
      welcomeBonus: {
        amount: WELCOME_BONUS_AMOUNT,
        currency,
        transactionId: welcomeTransaction?._id,
      },
    });
  } catch (error) {
    console.error("Create Account Error:", error);
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

// Get user accounts
async function getUserAccountsController(req, res) {
  try {
    const userId = req.user._id; // From auth middleware

    console.log("Fetching accounts for user:", userId);

    const accounts = await accountModel
      .find({ user: userId })
      .populate("user", "email firstName lastName profileImage")
      .sort({ createdAt: -1 });

    console.log("Accounts fetched:", accounts.length);

    // Return 200 even if no accounts found - it's a valid state
    res.status(200).json({
      status: "success",
      count: accounts.length,
      accounts: accounts || [],
    });
  } catch (error) {
    console.error("Get User Accounts Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get account by ID
async function getAccountByIdController(req, res) {
  try {
    const { accountId } = req.params;
    const userId = req.user._id; // From auth middleware

    console.log("Fetching account:", accountId);

    const account = await accountModel
      .findById(accountId)
      .populate("user", "email firstName lastName profileImage");

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    // Check if account belongs to authenticated user
    if (account.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized access to this account",
      });
    }

    res.status(200).json({
      status: "success",
      account,
    });
  } catch (error) {
    console.error("Get Account Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Update account status
async function updateAccountStatusController(req, res) {
  try {
    const { accountId } = req.params;
    const { status } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validate status
    if (!["ACTIVE", "FROZEN", "CLOSED"].includes(status)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid status. Must be ACTIVE, FROZEN, or CLOSED",
      });
    }

    console.log("Updating account status:", { accountId, status });

    const account = await accountModel.findById(accountId);

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    // Check if account belongs to authenticated user
    if (account.user.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized to update this account",
      });
    }

    account.status = status;
    await account.save();

    const populatedAccount = await account.populate(
      "user",
      "email firstName lastName profileImage",
    );

    console.log("Account status updated:", accountId);

    res.status(200).json({
      status: "success",
      message: "Account status updated successfully",
      account: populatedAccount,
    });
  } catch (error) {
    console.error("Update Account Status Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get account balance (calculated from ledger)
async function getUserBalanceController(req, res) {
  try {
    const { accountId } = req.params;
    const userId = req.user._id; // From auth middleware

    console.log("Fetching balance for account:", accountId);

    const account = await accountModel
      .findById(accountId)
      .populate("user", "email firstName lastName profileImage");

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    // Check if account belongs to authenticated user
    if (account.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized access to this account",
      });
    }

    // Calculate balance from ledger entries using aggregation
    const ledgerAggregation = await ledgerModel.aggregate([
      {
        $match: {
          account: new mongoose.Types.ObjectId(accountId),
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

    const calculatedBalance = ledgerAggregation[0]?.balance ?? 0;

    const balance = {
      accountId: account._id,
      currency: account.currency,
      balance: Number(calculatedBalance),
      lastUpdated: new Date(),
    };

    res.status(200).json({
      status: "success",
      balance,
    });
  } catch (error) {
    console.error("Get Balance Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Delete account (soft delete by closing)
async function deleteAccountController(req, res) {
  try {
    const { accountId } = req.params;
    const userId = req.user._id; // From auth middleware

    console.log("Deleting account:", accountId);

    const account = await accountModel.findById(accountId);

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    // Check if account belongs to authenticated user
    if (account.user.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized to delete this account",
      });
    }

    // Soft delete by setting status to CLOSED
    account.status = "CLOSED";
    await account.save();

    console.log("Account deleted (closed):", accountId);

    res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get account ledger entries
async function getAccountLedgerController(req, res) {
  try {
    const { accountId } = req.params;
    const userId = req.user._id; // From auth middleware

    console.log("Fetching ledger for account:", accountId);

    // Verify account exists and belongs to user
    const account = await accountModel.findById(accountId);

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    if (account.user.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized access to this account",
      });
    }

    // Get ledger entries with transaction details
    const ledgerEntries = await ledgerModel
      .find({ account: accountId })
      .populate({
        path: "transaction",
        populate: [
          { path: "fromAccount", select: "accountNumber currency user" },
          { path: "toAccount", select: "accountNumber currency user" },
        ],
      })
      .sort({ createdAt: -1 });

    // Calculate running balance
    let runningBalance = 0;
    const ledgerWithBalance = ledgerEntries
      .reverse()
      .map((entry) => {
        if (entry.direction === "CREDIT") {
          runningBalance += entry.amount;
        } else if (entry.direction === "DEBIT") {
          runningBalance -= entry.amount;
        }
        return {
          ...entry.toObject(),
          runningBalance: Number(runningBalance.toFixed(2)),
        };
      })
      .reverse();

    res.status(200).json({
      status: "success",
      count: ledgerWithBalance.length,
      ledger: ledgerWithBalance,
    });
  } catch (error) {
    console.error("Get Ledger Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get all ledger entries for user (across all accounts)
async function getUserLedgerController(req, res) {
  try {
    const userId = req.user._id; // From auth middleware

    console.log("Fetching ledger for user:", userId);

    // Get all user accounts
    const userAccounts = await accountModel
      .find({ user: userId })
      .select("_id");
    const accountIds = userAccounts.map((acc) => acc._id);

    if (accountIds.length === 0) {
      return res.status(200).json({
        status: "success",
        count: 0,
        ledger: [],
      });
    }

    // Get ledger entries for all user accounts
    const ledgerEntries = await ledgerModel
      .find({ account: { $in: accountIds } })
      .populate("account", "accountNumber currency")
      .populate({
        path: "transaction",
        populate: [
          { path: "fromAccount", select: "accountNumber currency user" },
          { path: "toAccount", select: "accountNumber currency user" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: ledgerEntries.length,
      ledger: ledgerEntries,
    });
  } catch (error) {
    console.error("Get User Ledger Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

export {
  createAccountController,
  getUserAccountsController,
  getAccountByIdController,
  updateAccountStatusController,
  getUserBalanceController,
  deleteAccountController,
  getAccountLedgerController,
  getUserLedgerController,
};
