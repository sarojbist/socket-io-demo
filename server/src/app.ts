import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { userRouter } from "./Routes/UserRouter";

export const app = express();
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
});

app.use("/api/v1/users", userRouter)

