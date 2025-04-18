"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Chatbubble from "./user/Chatbubble";
import { SendIcon } from "lucide-react";

interface Message {
  sender_name: string;
  message: string;
  timestamp: string;
  sender_id: string;
  receiver_id: string;
}

interface ChatProps {
  userId: string;
  receiverId: string;
  initialMessages?: Message[];
}

export default function Chat({ userId, receiverId, initialMessages = [] }: ChatProps) {
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Function to fetch old messages
  const fetchOldMessages = async () => {
    if (!receiverId) return;
    try {
      const response = await axios.get<Message[]>(`http://localhost:8000/messages/${userId}/${receiverId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching old messages:", error);
    }
  };

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((event: MessageEvent) => {
    const newMessage: Message = JSON.parse(event.data);
    setMessages((prev) => {
      if (
        (newMessage.sender_id === userId && newMessage.receiver_id === receiverId) ||
        (newMessage.sender_id === receiverId && newMessage.receiver_id === userId)
      ) {
        return [...prev, newMessage];
      }
      return prev;
    });
  }, [userId, receiverId]);

  // WebSocket setup
  useEffect(() => {
    if (!receiverId) return;

    fetchOldMessages(); // Load previous messages

    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = handleMessage;
    ws.onclose = () => console.warn("WebSocket disconnected.");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, receiverId, handleMessage]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      return alert("Connecting... Please wait!");
    }

    const timestamp = new Date().toISOString();

    const newMessage: Message = {
      sender_name: userId,
      sender_id: userId,
      receiver_id: receiverId,
      message,
      timestamp,
    };

    socket.send(JSON.stringify(newMessage));
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl border border-green-400 p-6 w-full">
      <h2 className="text-xl font-bold text-green-800 mb-4">
        {receiverId ? `Chatting with: ${receiverId}` : "Select a user to chat"}
      </h2>
      
      <div className="h-96 overflow-y-auto bg-[#f1fdf3] rounded-xl p-4 border border-green-200">
        <div className="flex flex-col gap-3">
          {messages.map((msg, index) => (
            <Chatbubble
              key={index}
              message={msg.message}
              timestamp={msg.timestamp}
              isSender={msg.sender_id === userId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
          <div className="pl-3">
            <button 
              type="submit" 
              className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
              aria-label="Send message"
            >
              <SendIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}