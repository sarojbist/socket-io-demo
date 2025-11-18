import { create } from "zustand";
import { io, Socket } from "socket.io-client";
// import { toast } from "sonner";
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

  connectSocket: (token: string) => void;
  sendMessage: (payload: SendMessagePayload) => void;
  addMessage: (msg: MessageType) => void;
};

export const useSocketStore = create<SocketStore>()(
  devtools((set, get) => ({
    socket: null,
    messages: [],

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connectSocket: (token) => {
      const socket = io(import.meta.env.VITE_SOCKET || "http://localhost:8080", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,

        auth: (cb) => {
          cb({
            token: localStorage.getItem("token"),
          });
        },
      });

      set({ socket });

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Incoming messages
      socket.on("new-message", (msg: MessageType) => {
        console.log("Incoming message:", msg);
        get().addMessage(msg);
      });
    },

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
