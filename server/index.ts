import express, { Request, Response } from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {})

io.on("connection", (socket) => {
  // ...
});

app.get("/", (req: Request, res: Response) => {
    res.send("Hi");
});

httpServer.listen(PORT, () => {
    console.log("App is Running on port", PORT);
});
