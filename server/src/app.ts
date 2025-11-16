import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { userRouter } from "./Routes/UserRouter";
import cors from "cors";
import UserController from "./Controllers/UserController";

export const app = express();
app.use(cors())
app.use(express.json());


export const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  socket.on("welcome", (msg) => {
    console.log("welcome msg:", msg)
  })

  socket.on("make-user-active", ({ userId, token }) => {
    console.log("User just got active ",userId, socket.id)
    UserController.makeUserActive({ userId, token }, socket)
  })

  socket.on("disconnect", () => {
    console.log("Client got disconnected", socket.id);
  })
});

app.use("/api/v1/users", userRouter)

