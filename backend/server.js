import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/user.routes.js";
import accountRouter from "./src/routes/account.routes.js";
import transactionRouter from "./src/routes/transaction.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://royal-mint-ankit.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
await connectDB();

app.get("/", (req, res) => {
  res.send("API running");
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
