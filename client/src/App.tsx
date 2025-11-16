import { Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Register from "./auth/register";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Profile from "./pages/profile";
import ProtectedRoute from "./auth/protectedRoute";

const socket = io("http://localhost:8080");

function App() {
  return (
    <div className="min-h-svh">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

function Home() {
  useEffect(() => {
    socket.emit("welcome", "Hello from frontend");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
