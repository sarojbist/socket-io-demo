import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { devtools } from "zustand/middleware";


type SocketStore = {
  socket: Socket | null;
  connectSocket: (token: string, userId: string) => void;
  makeUserActive: (token: string, userId: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const socketStore = (set: any, get: () => SocketStore): SocketStore => ({
  socket: null,

  connectSocket: (token: string, userId: string) => {
    if (get().socket) return;

    const socket = io(import.meta.env.VITE_SOCKET || "http://localhost:8080", {
      auth: { token },
      transports: ["websocket"],
    });

    console.log("socket", socket)

    // save socket instance
    set({ socket });

    // ------- LISTENERS (run only ONCE globally) -------
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("make-user-active-success", (msg) => {
      toast.success("User activated");
      console.log("User activated", msg);
    });

    socket.on("make-user-active-error", (err) => {
      toast.error(err?.message);
      console.error("Activation error", err);
    });

    // Emit AFTER listener setup
    socket.emit("make-user-active", { userId, token });
  },

   makeUserActive: (userId: string, token: string) => {
    const socket = get().socket;
    if (!socket) return console.warn("Socket not connected yet");

    socket.emit("make-user-active", { userId, token });
  },
});

export const useSocketStore = create<SocketStore>()(
  devtools(socketStore, { name: "Socket Store" })
);