// backend/src/lib/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    throw new Error("❌ MONGO_URI not defined in .env");
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
