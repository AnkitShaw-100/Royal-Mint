import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Register
async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password || !name) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const isExists = await userModel.findOne({ email });

    if (isExists) {
      return res.status(409).json({
        status: "failed",
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await userModel.create({
      email,
      password,
      name,
    });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Send response
    res.status(201).json({
      status: "success",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

// Login
async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Email and password are required",
      });
    }

    // Find user and include password
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

// Logout
async function userLogoutController(req, res) {
  try {
    // Clear cookie
    res.clearCookie("token");

    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

export { userRegisterController, userLoginController, userLogoutController };
