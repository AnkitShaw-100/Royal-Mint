import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return mongoose.connection;
    }

    console.log("Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: "majority",
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    
    // Log connection details for debugging
    console.error("MONGODB_URI configured:", !!process.env.MONGODB_URI);
    console.error("Mongoose state:", mongoose.connection.readyState);
    
    throw error;
  }
};

export default connectDB;
