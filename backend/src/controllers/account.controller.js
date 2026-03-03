import accountModel from "../models/account.model.js";
import userModel from "../models/user.model.js";
import ledgerModel from "../models/ledger.model.js";
import mongoose from "mongoose";

// Create new account for user
async function createAccountController(req, res) {
  try {
    const { currency = "INR", status = "ACTIVE" } = req.body;
    const userId = req.user._id; // From auth middleware

    console.log("Creating account for user:", userId, { currency, status });

    // Check if user already has account
    const existingAccount = await accountModel.findOne({ user: userId });
    if (existingAccount) {
      return res.status(400).json({
        status: "failed",
        message: "User already has an account",
      });
    }

    // Create new account
    const account = await accountModel.create({
      user: userId,
      currency,
      status,
    });

    // Populate user details
    const populatedAccount = await account.populate("user", "email firstName lastName profileImage");

    console.log("Account created successfully:", account._id);

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      account: populatedAccount,
    });
  } catch (error) {
    console.error("Create Account Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
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

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No accounts found for this user",
        accounts: [],
      });
    }

    console.log("Accounts fetched:", accounts.length);

    res.status(200).json({
      status: "success",
      count: accounts.length,
      accounts,
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

    const populatedAccount = await account.populate("user", "email firstName lastName profileImage");

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
      balance: Number(calculatedBalance).toFixed(2),
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

export {
  createAccountController,
  getUserAccountsController,
  getAccountByIdController,
  updateAccountStatusController,
  getUserBalanceController,
  deleteAccountController,
};
