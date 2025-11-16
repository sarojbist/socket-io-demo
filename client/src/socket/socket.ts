// import { io } from "socket.io-client";
// const socketUrl = import.meta.env.VITE_SOCKET || "http://localhost:8080";

// export const socket = io(socketUrl, {
//   auth: { token: localStorage.getItem("token") }
// });

// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;
// const socketUrl = import.meta.env.VITE_SOCKET || "http://localhost:8080";

// export const connectSocket = (token: string) => {
//   if (socket) return socket; // return existing instance

//   socket = io(socketUrl, {
//     auth: { token },
//     transports: ["websocket"],
//   });

//   return socket;
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

