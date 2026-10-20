import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.ATLASDB_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectDB;