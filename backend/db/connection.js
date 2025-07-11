import mongoose from "mongoose";
import { DB_NAME } from "../src/constant.js";

const connectToDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `\n database connected.. DB_HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGO_DB CONNECTION ERROR:", error);
    process.exit(1); // to exit the process
  }
};

export default connectToDb;
