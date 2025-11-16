import mongoose from "mongoose";
const dbUrl = process.env.DBURL;

export async function connectDatabase() {
    await mongoose.connect(dbUrl, {
        writeConcern: { w: "majority" },
        retryWrites: true,
    });
}
