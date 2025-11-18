import { ConversationModel } from "@/Models/ConversationModel";
import { MessageModel } from "@/Models/messageModel";
import { UserModel } from "@/Models/UserModel";
import { uploadOnCloudinary } from "@/Utils/cloudinaryUpload";
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
            const limit = parseInt(req.query.limit) || 50;

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

    //conversation handler sockets
    handleFileMessage = async (req, res) => {
        const socket = req.socket;
        const io = req.io;
        const onlineUsers = req.onlineUsers;

        try {
            const { conversationId, senderId } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "File is required"
                });
            }

            const conversation = await ConversationModel.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation not found"
                });
            }

            // 3. Upload to Cloudinary
            const fileUrl = await uploadOnCloudinary(req.file.path);

            if (!fileUrl) {
                return res.status(500).json({
                    success: false,
                    message: "File upload to Cloudinary failed"
                });
            }

            const messagePayload = {
                conversationId,
                senderId,
                type: "file",
                content: fileUrl,
            };

            const message = await MessageModel.create(messagePayload);

            conversation.lastMessageAt = new Date();
            await conversation.save();
            console.log("am i here?")
            if (socket) {
                socket.emit("new-message", message);
            } else {
                console.log("Sender offline — skipping sender emit");
            }

            const receiverId = conversation.participants.find(
                (id) => id.toString() !== senderId
            );

            if (receiverId) {
                const receiverSocketId = onlineUsers.get(receiverId.toString());

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("new-message", message);
                    console.log("Delivered file to receiver:", receiverSocketId);
                } else {
                    console.log("Receiver offline, saving only to DB.");
                }
            }

            return res.status(201).json({
                success: true,
                message: "File sent successfully",
                data: message
            });

        } catch (error) {
            console.error("File message error:", error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };


    //conversation handler sockets
    handleMessage = async ({ conversationId, senderId, content, type = "text" }, socket, io, onlineUsers) => {
        try {
            console.log("New Message:", { conversationId, senderId, content });

            // Validate conversation
            const conversation = await ConversationModel.findById(conversationId);
            if (!conversation) {
                return socket.emit("send-message-error", {
                    success: false,
                    message: "Conversation not found"
                });
            }

            // Save message in DB
            const messageDoc = await MessageModel.create({
                conversationId,
                senderId,
                content,
                type
            });

            const senderUserName = await UserModel.findById(messageDoc.senderId);

            // Update lastMessageAt
            conversation.lastMessageAt = new Date();
            await conversation.save();

            const message: any = messageDoc.toObject();
            message.sender = senderUserName.username;


            // Emit message to sender immediately
            // socket.emit("new-message", message);

            // Emit to receiver IF ONLINE
            const receiverId = conversation.participants.find(
                (id) => id.toString() !== senderId
            );

            if (!receiverId) {
                console.log("No receiver found — invalid conversation or sender mismatch");
                return socket.emit("send-message-error", {
                    success: false,
                    message: "Receiver not found for this conversation"
                });
            }
            const receiverSocketId = onlineUsers.get(receiverId.toString());

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("new-message", message);
                console.log("Delivered to receiver:", receiverSocketId);
            } else {
                console.log("Receiver offline, skipping socket emit");
            }

        } catch (error) {
            console.error("Send message error:", error);
            socket.emit("send-message-error", {
                success: false,
                message: error.message
            });
        }
    }

}

export default new ConversationController();
