import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
}, { timestamps: true });


export const UserModel = mongoose.model("user", userSchema);

