import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { devtools } from "zustand/middleware";

type MessageType = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
};

type SendMessagePayload = {
  conversationId: string;
  senderId: string;
  content: string;
};

type SocketStore = {
  socket: Socket | null;

  messages: MessageType[];

  connectSocket: (token: string, userId: string) => void;
  // makeUserActive: (token: string, userId: string) => void;

  sendMessage: (payload: SendMessagePayload) => void;
  addMessage: (msg: MessageType) => void;
};

export const useSocketStore = create<SocketStore>()(
  devtools((set, get) => ({
    socket: null,
    messages: [], // GLOBAL REALTIME MESSAGES

    connectSocket: (token, userId) => {
      if (get().socket) return;

      const socket = io(import.meta.env.VITE_SOCKET || "http://localhost:8080", {
        auth: { token },
        transports: ["websocket"],
      });

      set({ socket });

      // Listeners
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      socket.on("make-user-active-success", (msg) => {
        console.log("msg");
        toast.success("User activated");
      });

      socket.on("make-user-active-error", (err) => {
        toast.error(err?.message);
      });

      // Listen for messages FROM BACKEND
      socket.on("new-message", (msg: MessageType) => {
        console.log("Incoming message:", msg);
        toast.success(`Incoming message: ${msg.content}`);
        get().addMessage(msg);
      });

      socket.emit("make-user-active", { userId, token });
    },

    // makeUserActive: (userId, token) => {
    //   const socket = get().socket;
    //   if (!socket) return console.warn("Socket not connected yet");

    //   socket.emit("make-user-active", { userId, token });
    // },

    sendMessage: ({ conversationId, senderId, content }) => {
      const socket = get().socket;
      if (!socket) return console.warn("Socket not connected yet");

      socket.emit("send-message", {
        conversationId,
        senderId,
        content,
        type: "text",
      });
    },

    addMessage: (msg) =>
      set((state) => ({
        messages: [...state.messages, msg],
      })),
  }))
);
