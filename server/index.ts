import dotenv from "dotenv";
dotenv.config();
import { connectDatabase } from "./src/Models/db";
import { httpServer } from "@/app";


const PORT = Number(process.env.PORT) || 8080;

connectDatabase()
  .then(() => {
    console.log("Connected to Database Successfully");
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log("App is Running on port", PORT);
    });

  })
  .catch((err) => {
    console.log("Error connecting to Database due to", err);
  });
