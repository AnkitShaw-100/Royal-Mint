import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createAccountController,
  getUserAccountsController,
  getAccountByIdController,
  updateAccountStatusController,
  getUserBalanceController,
  deleteAccountController,
} from "../controllers/account.controller.js";

const router = express.Router();

// All account routes require authentication
router.use(authMiddleware);

// POST - Create new account
router.post("/create", createAccountController);

// GET - Get all accounts for authenticated user
router.get("/", getUserAccountsController);

// GET - Get specific account by ID
router.get("/:accountId", getAccountByIdController);

// GET - Get account balance
router.get("/:accountId/balance", getUserBalanceController);

// PUT - Update account status
router.put("/:accountId/status", updateAccountStatusController);

// DELETE - Delete account (soft delete)
router.delete("/:accountId", deleteAccountController);

export default router;
