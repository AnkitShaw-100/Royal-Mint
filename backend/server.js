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

console.log("Allowed Origins:", allowedOrigins);

// Middleware - CORS must be first
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      console.log("CORS check - Origin:", origin, "Normalized:", normalizedOrigin, "Allowed:", allowedOrigins.includes(normalizedOrigin));
      
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      const err = new Error(`CORS blocked for origin: ${origin}`);
      err.status = 403;
      return callback(err);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-clerk-id"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Error handling middleware for CORS errors
app.use((err, req, res, next) => {
  if (err.status === 403) {
    return res.status(403).json({
      status: "error",
      message: err.message,
    });
  }
  next(err);
});

// Connect to MongoDB
let dbConnected = false;
connectDB()
  .then(() => {
    dbConnected = true;
    console.log("✓ MongoDB connection successful");
  })
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err.message);
    // Don't throw - let the app start and queries will fail gracefully
  });

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API running",
    mongoConnected: dbConnected,
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongoConnected: dbConnected,
  });
});

// Handle preflight requests - use middleware form instead of app.options
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-clerk-id");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

// Vercel/serverless deployments may forward paths without the /api prefix.
app.use("/users", userRouter);
app.use("/accounts", accountRouter);
app.use("/transactions", transactionRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message, err.stack);
  
  // If headers already sent, delegate to default handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle Mongoose timeout errors
  if (err.name === "MongooseError" && err.message.includes("buffering timed out")) {
    return res.status(503).json({
      status: "error",
      message: "Database connection timeout. Please try again.",
      error: "DATABASE_TIMEOUT",
    });
  }

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// For local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
export default app;
