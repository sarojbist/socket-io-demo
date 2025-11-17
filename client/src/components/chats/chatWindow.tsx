import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const staticMessages = [
  { id: 1, sender: "me", text: "Hey bro!", time: "10:30 AM" },
  { id: 2, sender: "them", text: "What's up?", time: "10:31 AM" },
  { id: 3, sender: "me", text: "Working on Socket.io 💻", time: "10:32 AM" },
];

interface ChatWindowProps {
  user: {
    id: string;
    username: string;
    isOnline: boolean;
  } | null;
}

export default function ChatWindow({ user }: ChatWindowProps) {
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a user to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {user.username[0].toUpperCase()}

          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              user.isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div>
          <p className="font-medium">{user.username}</p>
          <p className="text-xs text-muted-foreground">
            {user.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 space-y-3">
        {staticMessages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] px-4 py-2 rounded-lg shadow text-sm ${
              msg.sender === "me"
                ? "ml-auto bg-primary text-white"
                : "mr-auto bg-muted"
            }`}
          >
            {msg.text}
            <p className="text-[10px] opacity-70 mt-1">{msg.time}</p>
          </div>
        ))}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <Input placeholder="Type a message..." />
        <Button>Send</Button>
      </div>
    </div>
  );
}
