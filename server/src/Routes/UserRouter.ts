import UserController from "@/Controllers/UserController";
import { verifyJwt } from "@/Utils/jwtAuth";
import express from "express";
export const userRouter = express.Router();


userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
userRouter.post("/get-online-users", UserController.getOnlineUsers);
userRouter.post("/get-my-details", UserController.getMe);

userRouter.post("/get-all-contacts", verifyJwt, UserController.getAllUsersSorted);



