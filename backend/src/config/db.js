import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/placement_portal";
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    if (error.message.includes("ECONNREFUSED")) {
      console.error("Local MongoDB is not running on 127.0.0.1:27017.");
    }
    process.exit(1);
  }
};

export default connectDB;
