
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { createConversation, getMessages, sendFileMessage } from "@/services/userService";
import { useSocketStore } from "@/store/useSocketStore";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

interface ChatWindowProps {
    user: {
        _id: string;
        username: string;
        isOnline: boolean;
    } | null;
    onBack: () => void;
}

export function ChatWindow({ user, onBack }: ChatWindowProps) {
    const raw = localStorage.getItem("user");
    const me = raw ? JSON.parse(raw) : null;

    const [conversationId, setConversationId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

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

    const { data, isLoading } = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => getMessages({ conversationId: conversationId! }),
        enabled: !!conversationId,
    });

    const sendMessage = useSocketStore(s => s.sendMessage);
    const realtimeMessages = useSocketStore((s) => s.messages);

    const messagesApi = data?.messages || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const messages = [
        ...messagesApi,
        ...realtimeMessages.filter(
            (m) => m.conversationId === conversationId
        ),
    ];

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    function handleMessageSend() {
        if (conversationId && input.trim()) {
            sendMessage({
                conversationId,
                senderId: me.id,
                content: input,
            });
            setInput("");
        }
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleMessageSend();
        }
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !conversationId) return;

        try {
            await sendFileMessage({
                file,
                conversationId,
                senderId: me.id,
            });

            e.target.value = "";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(`File upload failed due to ${err.msg}`);
        }
    }
    function isImageUrl(url: string) {
        return /\.(png|jpg|jpeg|gif|webp)$/i.test(url);
    }


    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground px-4 text-center">
                <p>Select a contact to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="border-b p-3 sm:p-4 flex items-center gap-3 bg-card shrink-0">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="md:hidden"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}

                <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                    {user.username[0].toUpperCase()}
                    <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-card ${user.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                    />
                </div>

                <div className="min-w-0">
                    <p className="font-medium truncate text-sm sm:text-base">{user.username}</p>
                    <p className="text-xs text-muted-foreground">
                        {user.isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4" ref={scrollRef}>
                <div className="space-y-3">
                    {isLoading ? (
                        <p className="text-center text-muted-foreground text-sm">Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p className="text-center text-muted-foreground text-sm mt-8">
                            No messages yet. Start the conversation!
                        </p>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`flex ${msg.senderId === me.id ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 rounded-2xl shadow-sm ${msg.senderId === me.id
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-muted text-foreground rounded-bl-sm"
                                        }`}
                                >

                                    {/* 🔥 MESSAGE TYPE HANDLER */}
                                    {msg.content.startsWith("http") ? (
                                        isImageUrl(msg.content) ? (
                                            <img
                                                src={msg.content}
                                                alt="image"
                                                className="max-w-[180px] max-h-[180px] rounded-lg object-cover border"
                                            />
                                        ) : (
                                            <a
                                                href={msg.content}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-background rounded-md p-2 text-sm underline"
                                            >
                                                📄 File
                                            </a>
                                        )
                                    ) : (
                                        <p className="text-sm break-words">{msg.content}</p>
                                    )}

                                    <p className="text-[10px] opacity-70 mt-1">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>


            {/* Input */}
            {/* Input Bar */}
            <div className="p-3 border-t flex items-center gap-2">

                {/* Hidden file input */}
                <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                />

                {/* File icon */}
                <label htmlFor="file-input" className="cursor-pointer text-xl">
                    📎
                </label>

                {/* Text input */}
                <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                />

                {/* Send button */}
                <Button onClick={handleMessageSend} size="icon" disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>


        </div>
    );
}