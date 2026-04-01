import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Primary MongoDB connection failed. Falling back to in-memory MongoDB.");
      // eslint-disable-next-line no-console
      console.warn(error.message);

      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      await mongoose.connect(memoryUri);
      // eslint-disable-next-line no-console
      console.log("Using in-memory MongoDB fallback.");
    }
  } else {
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    // eslint-disable-next-line no-console
    console.log("MONGODB_URI missing. Using in-memory MongoDB for local development.");
  }

  // eslint-disable-next-line no-console
  console.log("MongoDB connected successfully.");
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
