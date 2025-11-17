import mongoose from "mongoose";

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
    ],
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model(
  "conversation",
  conversationSchema
);
