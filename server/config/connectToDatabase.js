import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({ path: "./dev.env" });

export default async function connectToDb() {
     try {
          mongoose.connect(process.env.DB_LOCAL);
          console.log("Connected to MongoDB");
     } catch (error) {
          console.log(`Failed to connect to database: ${error.message}`);
     }
}