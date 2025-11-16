import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
    socketId: String
}, { timestamps: true });

// validate password
userSchema.methods.validatePassword = async function (passwordByUser) {
    const isPasswordCorrect = await bcrypt.compare(passwordByUser, this.password);
    return isPasswordCorrect;
};

export const UserModel = mongoose.model("user", userSchema);

