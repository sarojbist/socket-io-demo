import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createConversation, getMessages } from "@/services/userService";

interface ChatWindowProps {
    user: {
        _id: string;
        username: string;
        isOnline: boolean;
    } | null;
}

export default function ChatWindow({ user }: ChatWindowProps) {
    // 1. Get my own info from localStorage
    const raw = localStorage.getItem("user");
    const me = raw ? JSON.parse(raw) : null;

    const [conversationId, setConversationId] = useState<string | null>(null);
    const [input, setInput] = useState("");

    // 2. Create/Get conversation on user click
    useEffect(() => {
        if (!me || !user) return;

        const fetchConversation = async () => {
            const res = await createConversation({
                userId1: me.id,
                userId2: user._id,
            });

            setConversationId(res._id);
        };

        fetchConversation();
    }, [user]);

    // 3. Fetch messages for this conversation
    const { data, isLoading } = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => getMessages({ conversationId: conversationId! }),
        enabled: !!conversationId,
    });

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a user to start chatting.
            </div>
        );
    }

    const messages = data?.messages || [];

    return (
        <div className="flex flex-col flex-1">
            {/* Header */}
            <div className="border-b p-4 flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {user.username[0].toUpperCase()}

                    <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${user.isOnline ? "bg-green-500" : "bg-gray-400"
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
            <ScrollArea className="p-2 space-y-1 max-h-[calc(100vh-200px)]">
                {isLoading ? (
                    <p>Loading messages...</p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`max-w-[70%] px-4 py-2 rounded-lg shadow text-sm ${msg.senderId === me.id
                                    ? "ml-auto bg-primary text-white"
                                    : "mr-auto bg-muted"
                                }`}
                        >
                            {msg.content}
                            <p className="text-[10px] opacity-70 mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    ))
                )}
            </ScrollArea>
            {/* Input */}
            <div className="p-4 border-t flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button>Send</Button>
            </div>
        </div>
    );
}
