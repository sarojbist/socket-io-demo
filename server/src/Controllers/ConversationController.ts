import { ConversationModel } from "@/Models/ConversationModel";
import { MessageModel } from "@/Models/messageModel";
import { UserModel } from "@/Models/UserModel";
import { Request, Response } from "express";

class ConversationController {

    getOrCreateConversation = async (req: Request, res: Response) => {
        try {
            const { userId1, userId2 } = req.body;

            if (!userId1 || !userId2) {
                return res.status(400).json({
                    success: false,
                    message: "Both user IDs are required",
                });
            }

            // Make sure users exist
            const user1 = await UserModel.findById(userId1);
            const user2 = await UserModel.findById(userId2);

            if (!user1 || !user2) {
                return res.status(404).json({
                    success: false,
                    message: "One or both users do not exist",
                });
            }

            let conversation = await ConversationModel.findOne({
                participants: { $all: [userId1, userId2] }
            });

            // Create new conversation if not found
            if (!conversation) {
                conversation = await ConversationModel.create({
                    participants: [userId1, userId2]
                });
            }

            return res.status(200).json({
                success: true,
                conversation,
            });

        } catch (error) {
            console.error("Get or create conversation error:", error);

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };


    getMessages = async (req, res) => {
        try {
            const { conversationId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    message: "Conversation ID is required",
                });
            }

            const conversation = await ConversationModel.findById(conversationId);

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation not found",
                });
            }

            const skip = (page - 1) * limit;

            const messages = await MessageModel.find({ conversationId })
                .sort({ createdAt: -1 })   
                .skip(skip)
                .limit(limit)
                .lean();

            return res.status(200).json({
                success: true,
                page,
                limit,
                messages: messages.reverse(), // return oldest → newest
            });

        } catch (error) {
            console.error("Get messages error:", error);

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };
}

export default new ConversationController();
