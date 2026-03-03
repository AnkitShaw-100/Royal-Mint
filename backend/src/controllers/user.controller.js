import userModel from "../models/user.model.js";

// Save or update user from Clerk
async function saveOrUpdateUserController(req, res) {
  try {
    const { clerkId, email, firstName, lastName, profileImage } = req.body;

    // Validate required fields
    if (!clerkId || !email) {
      console.log("Missing required fields:", { clerkId, email });
      return res.status(400).json({
        status: "failed",
        message: "Clerk ID and email are required",
      });
    }

    console.log("Syncing user:", { clerkId, email, firstName, lastName });

    // Find user and update, or create if doesn't exist
    let user = await userModel.findOne({ clerkId });

    if (user) {
      // Update existing user
      console.log("Updating existing user:", clerkId);
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.profileImage = profileImage;
      await user.save();
    } else {
      // Create new user
      console.log("Creating new user:", clerkId);
      user = await userModel.create({
        clerkId,
        email,
        firstName,
        lastName,
        profileImage,
      });
    }

    console.log("User synced successfully:", user);

    res.status(201).json({
      status: "success",
      message: "User saved successfully",
      user: {
        _id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Save User Error:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get user by Clerk ID
async function getUserController(req, res) {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({
        status: "failed",
        message: "Clerk ID is required",
      });
    }

    console.log("Fetching user:", clerkId);
    const user = await userModel.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get all users (for testing/admin)
async function getAllUsersController(req, res) {
  try {
    console.log("Fetching all users");
    const users = await userModel.find().select("-__v").sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

export { saveOrUpdateUserController, getUserController, getAllUsersController };
