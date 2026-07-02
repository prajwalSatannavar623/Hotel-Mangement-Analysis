import mongoose from "mongoose";
import { DB_URL } from "../constants.js";

async function connectToMongoDB() {
  try {
    const mongooseInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URL}/${DB_URL}`,
    );

    console.log(
      `Connected to MongoDB :: DB config - ${(await mongooseInstance).connection.host}`,
    );
  } catch (error) {
    console.log(`DATABASE CONECTION ERROR :: ${error}`);
    process.exit(1);
  }
}

export { connectToMongoDB };
