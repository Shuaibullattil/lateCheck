"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Chatbubble from "./user/Chatbubble";
import { SERVER_URL, WS_URL } from "../../config";

interface Message {
  sender_name : string;
  message: string;
  timestamp: string;
  sender_id: string;
  receiver_id: string;
}

interface ChatProps {
  userId: string;
  receiverId: string;
  initialMessages?: Message[];
  onNewMessage?: (message: Message) => void;
}

export default function Chat({ userId, receiverId, initialMessages = [], onNewMessage }: ChatProps) {
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Function to fetch old messages
  const fetchOldMessages = async () => {
    if (!receiverId) return;
    try {
      const response = await axios.get<Message[]>(`${SERVER_URL}/messages/${userId}/${receiverId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching old messages:", error);
    }
  };

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((event: MessageEvent) => {
    const newMessage: Message = JSON.parse(event.data);
    console.log("New message received:", newMessage);
    
    setMessages((prev) => {
      // Check if this message belongs to the current chat
      if (
        (newMessage.sender_id === userId && newMessage.receiver_id === receiverId) ||
        (newMessage.sender_id === receiverId && newMessage.receiver_id === userId)
      ) {
        console.log("Adding message to chat:", newMessage);
        return [...prev, newMessage];
      }
      return prev;
    });
  }, [userId, receiverId]);

  // WebSocket setup
  useEffect(() => {
    if (!receiverId) return;

    fetchOldMessages(); // Load previous messages

    const ws = new WebSocket(`${WS_URL}/ws/${userId}`);

    ws.onopen = () => console.log("Connected to WebSocket"); 
    ws.onmessage = handleMessage;
    ws.onclose = () => console.warn("WebSocket disconnected.");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, receiverId, handleMessage]);

  // Update messages when initialMessages changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

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
      sender_name : userId,
      sender_id: userId,
      receiver_id: receiverId,
      message,
      timestamp,
    };

    console.log("Sending message:", newMessage);
    socket.send(JSON.stringify(newMessage));
    setMessages((prev) => [...prev, newMessage]);
    if (onNewMessage) {
      onNewMessage(newMessage);
    }
    setMessage("");
  };

  return (
    <div className="p-4 rounded shadow-md w-full bottom-0">
      <h2 className="text-lg font-bold mb-2">Inbox: {receiverId || "Select a user"}</h2>
      <div className="h-96 overflow-y-auto border p-2">
        <div className="flex flex-col gap-2">
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
      <div className="mt-2 flex">
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="px-2">
            <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              <img src="/send-icon.svg" alt="Send" className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
