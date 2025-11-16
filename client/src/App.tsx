import { Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Register from "./auth/register";

function App() {
  return (
    <div className="min-h-svh">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
