import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createTransactionController,
  getUserTransactionsController,
  getTransactionByIdController,
  updateTransactionStatusController,
} from "../controllers/transaction.controller.js";

const router = express.Router();

// All transaction routes require authentication
router.use(authMiddleware);

// POST - Create transaction
router.post("/create", createTransactionController);

// GET - Get all user transactions
router.get("/", getUserTransactionsController);

// GET - Get transaction by ID
router.get("/:transactionId", getTransactionByIdController);

// PUT - Update transaction status
router.put("/:transactionId/status", updateTransactionStatusController);

export default router;
