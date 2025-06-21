import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";

dotenv.config();

let server: Server;

const PORT = 5000;

async function main() {
  try {
    server = app.listen(PORT, async () => {
      await mongoose.connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pns8cwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
      );
      console.log("Connect to MongoDB with Mongoose successfully✅");
      console.log(`Library management app is running🏃🏼‍♂️ on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
