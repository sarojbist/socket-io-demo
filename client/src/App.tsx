import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:8080");
  socket.emit("welcome", "hey boy how are you?")
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  )
}

export default App