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

const normalizeOrigin = (value) =>
  String(value || "")
    .trim()
    .replace(/\/+$/, "");

const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
];

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://royal-mint-ankit.vercel.app",
  "https://try-royal-mint.vercel.app",
  ...configuredOrigins,
]
  .map(normalizeOrigin)
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-clerk-id"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});

app.get("/", (req, res) => {
  res.send("API running");
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

// Vercel/serverless deployments may forward paths without the /api prefix.
app.use("/users", userRouter);
app.use("/accounts", accountRouter);
app.use("/transactions", transactionRouter);

// For local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
export default app;
