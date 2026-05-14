import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async (uri) => {
  try {
    // Try connecting to the primary database with a 5-second timeout
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB Connected Successfully ✅");
  } catch (err) {
    console.warn("⚠️ Could not connect to remote MongoDB Atlas Cluster.");
    console.warn("Reason:", err.message);
    console.log("🔄 Starting Local In-Memory Database fallback for development...");
    
    try {
      const mongod = await MongoMemoryServer.create();
      const localUri = mongod.getUri();
      await mongoose.connect(localUri);
      console.log("Local In-Memory MongoDB Started successfully! ✅");
      console.log("👉 Data will be stored in RAM and reset on every server restart.");
    } catch (localErr) {
      console.error("❌ Critical Failure: Could not start Local Database fallback either.");
      console.error(localErr.message);
      process.exit(1);
    }
  }
};

export default connectDB;
