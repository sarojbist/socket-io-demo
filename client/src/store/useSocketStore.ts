import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useUsersStore } from "./onlineUsersStore";

type MessageType = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
  sender: string;
};

type SendMessagePayload = {
  conversationId: string;
  senderId: string;
  content: string;
};

type SocketStore = {
  socket: Socket | null;

  messages: MessageType[];

  connectSocket: () => void;
  sendMessage: (payload: SendMessagePayload) => void;
  addMessage: (msg: MessageType) => void;
  clearMessages: () => void;

};
const socketUrl = "https://socket-backend-928159139419.asia-south1.run.app";
// const socketUrl = import.meta.env.VITE_SOCKET;

export const useSocketStore = create<SocketStore>()(
  (set, get) => ({
    socket: null,
    messages: [],

    connectSocket: () => {
      const socket = io(socketUrl, {
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
        console.log("new", msg)

        const me = JSON.parse(localStorage.getItem("user") || "{}");

        if (msg.senderId !== me.id) {
          toast.success(`${msg.sender} sent you ${msg.content}`);
        }
        get().addMessage(msg);
      });
      const setOnlineUsers = useUsersStore.getState().setOnlineUsers;

      socket.on("online-users", (users: string[]) => {
        setOnlineUsers(users);
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

    clearMessages: () =>
      set({
        messages: [],
      }),
  }));
