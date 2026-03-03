import express from "express";
import {
  saveOrUpdateUserController,
  getUserController,
  getAllUsersController,
} from "../controllers/user.controller.js";

const router = express.Router();

// POST - Save or update user
router.post("/save", saveOrUpdateUserController);

// GET - Get all users
router.get("/", getAllUsersController);

// GET - Get user by Clerk ID
router.get("/:clerkId", getUserController);

export default router;
