import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Attempting to connect to DB");
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
