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
    };
}

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [senderId, setSenderId] = useState("");
    const [receiverId,setReceiverId] = useState("")
    const [messages, setMessages] = useState<{ message: string; timestamp: string; sender_id: string; sender_name: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
      if (typeof window === "undefined") return;
    
      const fetchData = async () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setSenderId(parsedUser?.details?.email);
    
          try {
            const response = await axios.get("http://localhost:8000/get/wardenemail", {
              params: {
                hostel: parsedUser?.details?.hostel,
              },
            });
            const wardenEmail = response.data.email;
            setReceiverId(wardenEmail); // This sets the receiverId state
            console.log("Warden Email:", wardenEmail);
          } catch (error) {
            console.error("Failed to fetch warden email:", error);
          }
        } else {
          router.replace("/");
        }
      };
    
      fetchData();
    }, [router]);

    // Fetch initial messages
    useEffect(() => {
      const fetchMessages = async () => {
          try {
              if (!senderId || !receiverId) return; // Don't fetch if either is empty
              
              const response = await fetch(`http://localhost:8000/messages/${senderId}/${receiverId}`);
              const data = await response.json();
              setMessages(data);
          } catch (error) {
              console.error("Error fetching messages:", error);
          }
      };
  
      if (senderId && receiverId) {
          fetchMessages();
      }
  }, [senderId, receiverId]); // Add receiverId as dependency

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
    }, [senderId]);

    if (!user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !socket) return;

        const timestamp = new Date().toISOString();

        const newMessage = { 
            sender_id: senderId, 
            receiver_id: receiverId, 
            message, 
            timestamp,
            sender_name: user.details.email
        };
        socket.send(JSON.stringify(newMessage));
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };

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
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender_id === senderId ? "justify-end" : "justify-start"}`}>
                    <Chatbubble
                      message={msg.message}
                      timestamp={msg.timestamp}
                      isSender={msg.sender_id === senderId}
                    />
                  </div>
                ))}
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
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className="flex-1 p-3 rounded-lg bg-[#f1fdf3] border border-green-200 focus:outline-none text-sm text-green-800"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="ml-3 p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                  <img src="/send-icon.svg" alt="Send" className="h-5 w-5" />
                </button>
              </form>
            </div>
          </main>
          <footer className=" left-0 w-fullp-3 z-50">
              <div className="flex justify-center">
                <MenuButton />
              </div>
            </footer>
        </div>
      );
}
