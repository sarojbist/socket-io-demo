import { connectDatabase } from "./src/Models/db";
import dotenv from "dotenv";
import { httpServer } from "@/app";
dotenv.config();

const PORT = process.env.PORT || 8080;

connectDatabase()
  .then(() => {
    console.log("Connected to Database Successfully");
    httpServer.listen(PORT, () => {
      console.log("App is Running on port", PORT);
    });
  })
  .catch((err) => {
    console.log("Error connecting to Database due to", err);
  });
