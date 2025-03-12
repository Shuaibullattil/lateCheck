"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MenuButton from "../components/user/menubutton";
import Chatbubble from "../components/user/Chatbubble";

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [senderId, setSenderId] = useState("");
    const [receiverId, setReceiverId] = useState("saharawardenofficial@gmail.com");
    const [messages, setMessages] = useState<{ message: string; timestamp: string; sender_id: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setSenderId(parsedUser?.details?.email);
        } else {
            router.replace("/");
        }
    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!senderId) return;
        const ws = new WebSocket(`ws://localhost:8000/ws/${senderId}`);
        setSocket(ws);
    
        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            if (
                (newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
                (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId)
            ) {
                setMessages((prev) => [...prev, newMessage]);
            }
        };
    
        return () => ws.close();
    }, [senderId, receiverId]);

    if (!user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !socket) return;

        const timestamp = new Date().toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric"
        });

        const newMessage = { sender_id: senderId, receiver_id: receiverId, message, timestamp };
        socket.send(JSON.stringify(newMessage));
        setMessages([...messages, newMessage]);
        setMessage("");
    };

    return (
        <div className="h-screen flex flex-col">
            <header className="fixed top-0 left-0 w-full bg-green-600 shadow-xl p-4 z-50">
                <h1 className="text-left text-xl text-white font-bold">LateCheck</h1>
            </header>
            <main className="flex-1 overflow-y-auto pt-16 pb-16 px-4">
                <div className="flex justify-center items-center">
                    <h1 className="text-gray-400 font-black text-3xl py-4">Messages to warden</h1>
                </div>
                <div className="flex flex-col gap-2">
                    {messages.map((msg, index) => (
                        <Chatbubble 
                            key={index} 
                            message={msg.message} 
                            timestamp={msg.timestamp} 
                            isSender={msg.sender_id === senderId}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="fixed bottom-0 left-0 w-full shadow-md p-2 z-50 bg-white">
                <div className="flex justify-center items-center gap-2 p-2 bg-gray-200 rounded-xl w-full max-w-md mx-auto">
                    <form onSubmit={handleSubmit} className="flex w-full">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <div className="px-2">
                            <button type="submit" className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                                <img src="/send-icon.svg" alt="Send" className="h-6 w-6" />
                            </button>
                        </div>
                    </form>
                </div>
            </footer>
        </div>
    );
}