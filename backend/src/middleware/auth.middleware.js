import userModel from "../models/user.model.js";

/**
 * Auth Middleware - Verify clerkId from request
 * Expects clerkId in headers: x-clerk-id
 * or from decoded JWT token
 */
async function authMiddleware(req, res, next) {
  try {
    // Get clerkId from header
    const clerkId = req.headers["x-clerk-id"];

    if (!clerkId) {
      return res.status(401).json({
        status: "failed",
        message: "Authentication required. Please provide clerk ID",
      });
    }

    console.log("Auth middleware - Verifying clerkId:", clerkId);

    // Find user by clerkId
    const user = await userModel.findOne({ clerkId });

    if (!user) {
      console.log("User not found for clerkId:", clerkId);
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = user;
    req.clerkId = clerkId;

    console.log("User authenticated:", user.email);
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({
      status: "error",
      message: "Authentication error",
      error: error.message,
    });
  }
}

/**
 * System User Middleware - Verify user is a system admin
 * Must be used AFTER authMiddleware
 * Checks if req.user.isSystemUser === true
 */
async function systemUserMiddleware(req, res, next) {
  try {
    // Check if user was authenticated by authMiddleware
    if (!req.user) {
      return res.status(401).json({
        status: "failed",
        message: "Authentication required. Please use authMiddleware first.",
      });
    }

    // Check if user is a system user
    if (!req.user.isSystemUser) {
      console.log(
        "Access denied - User is not a system admin:",
        req.user.email
      );
      return res.status(403).json({
        status: "failed",
        message: "Access denied. System administrator privileges required.",
      });
    }

    console.log("System user access granted:", req.user.email);
    next();
  } catch (error) {
    console.error("System User Middleware Error:", error);
    res.status(500).json({
      status: "error",
      message: "Authorization error",
      error: error.message,
    });
  }
}

export default authMiddleware;
export { authMiddleware, systemUserMiddleware };