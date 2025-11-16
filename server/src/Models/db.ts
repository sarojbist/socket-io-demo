import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbUrl = process.env.DBURL;

export async function connectDatabase() {
    console.log("hey", dbUrl)
    await mongoose.connect(dbUrl, {
        writeConcern: { w: "majority" },
        retryWrites: true,
    });
}
