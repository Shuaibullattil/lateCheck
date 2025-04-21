"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Chatbubble from "../components/user/Chatbubble";
import { ArrowLeft } from "lucide-react";
import MenuButton from "../components/user/menubutton";
import axios from "axios";

interface User {
    details: {
        email: string;
        hostel?: string;
    };
}

interface Message {
    message: string;
    timestamp: string;
    sender_id: string;
    receiver_id?: string;
    sender_name: string;
}

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const socketRef = useRef<WebSocket | null>(null);
    const [senderId, setSenderId] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user data and set up sender/receiver IDs
    useEffect(() => {
        if (typeof window === "undefined") return;
      
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    router.replace("/");
                    return;
                }
                
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setSenderId(parsedUser?.details?.email);
        
                // Fetch warden email only if hostel exists
                if (parsedUser?.details?.hostel) {
                    const response = await axios.get("http://localhost:8000/get/wardenemail", {
                        params: { hostel: parsedUser.details.hostel }
                    });
                    setReceiverId(response.data.email);
                } else {
                    console.error("No hostel information found for user");
                }
            } catch (error) {
                console.error("Failed to fetch user data or warden email:", error);
            } finally {
                setIsLoading(false);
            }
        };
      
        fetchData();
    }, [router]);

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!senderId || !receiverId) return;
            
            try {
                const response = await fetch(`http://localhost:8000/messages/${senderId}/${receiverId}`);
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
    
        if (senderId && receiverId) {
            fetchMessages();
        }
    }, [senderId, receiverId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Set up WebSocket connection
    useEffect(() => {
        // Only establish connection if we have both sender and receiver IDs
        if (!senderId) return;
        
        // Clean up any existing connection
        if (socketRef.current) {
            socketRef.current.close();
        }
        
        // Create new connection
        const ws = new WebSocket(`ws://localhost:8000/ws/${senderId}`);
        socketRef.current = ws;
        
        // Handle incoming messages
        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            // Only add messages relevant to this conversation
            if (
                (newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
                (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId)
            ) {
                setMessages(prev => [...prev, newMessage]);
            }
        };
        
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        
        // Clean up on unmount
        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        };
    }, [senderId, receiverId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !receiverId) return;

        const timestamp = new Date().toISOString();
        const newMessage = { 
            sender_id: senderId, 
            receiver_id: receiverId, 
            message: message.trim(), 
            timestamp,
            sender_name: user?.details?.email || senderId
        };
        
        socketRef.current.send(JSON.stringify(newMessage));
        setMessages(prev => [...prev, newMessage]);
        setMessage("");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f1fdf3]">
                <div className="text-green-700">Loading chat...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f1fdf3]">
          {/* Header */}
          <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-10">
              <button
                onClick={() => router.push("/home")}
                className="flex items-center gap-2 text-green-600 hover:text-green-800"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="text-green-700 font-bold text-xl">Talk to the Warden</div>
            </div>
          </header>
    
          {/* Spacer */}
          <div className="h-20" />
    
          {/* Chat container */}
          <main className="flex flex-col flex-1 px-4 sm:px-8 max-w-3xl w-full mx-auto pb-24">
            <div className="flex flex-col bg-white rounded-3xl shadow-lg border border-green-300 flex-1 overflow-hidden">
              {/* Messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-260px)] pr-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 my-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender_id === senderId ? "justify-end" : "justify-start"}`}>
                      <Chatbubble
                        message={msg.message}
                        timestamp={msg.timestamp}
                        isSender={msg.sender_id === senderId}
                      />
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input form */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center p-4 border-t border-green-200 bg-white"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 p-3 rounded-lg bg-[#f1fdf3] border border-green-200 focus:outline-none text-sm text-green-800"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  disabled={!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN}
                  className="ml-3 p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:bg-green-400"
                >
                  <img src="/send-icon.svg" alt="Send" className="h-5 w-5" />
                </button>
              </form>
            </div>
          </main>
          <footer className="left-0 w-full p-3 z-50">
            <div className="flex justify-center">
              <MenuButton />
            </div>
          </footer>
        </div>
    );
}