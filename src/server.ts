import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";

dotenv.config();

let server: Server;

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pns8cwr.mongodb.net/library_management_db?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connect to MongoDB with Mongoose successfully✅");

    server = app.listen(PORT, async () => {
      console.log(`Library management app is running🏃🏼‍♂️ on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB or start server:", error);
    process.exit(1);
  }
}

main();
