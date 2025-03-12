"use client";
import { useEffect, useState, useRef } from "react";
import Chatbubble from "./user/Chatbubble";

interface Message {
  message: string;
  timestamp: string;
  sender_id: string;
  receiver_id: string;
}

interface ChatProps {
  userId: string;
  receiverId: string;
}

export default function Chat({ userId, receiverId,}: ChatProps) {
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    ws.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      if (
        (newMessage.sender_id === userId && newMessage.receiver_id === receiverId) ||
        (newMessage.sender_id === receiverId && newMessage.receiver_id === userId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId, receiverId]); // ✅ Correct dependencies

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      return alert("Connecting... Please wait!");
    }

    // Generate timestamp
    const timestamp = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Construct new message object
    const newMessage: Message = {
      sender_id: userId,
      receiver_id: receiverId,
      message,
      timestamp,
    };

    // Send message through WebSocket
    socket.send(JSON.stringify(newMessage));

    // Add new message to state
    setMessages((prev) => [...prev, newMessage]);
    setMessage(""); // Clear input field
  };

  return (
    <div className="p-4 rounded shadow-md w-full bottom-0">
      <h2 className="text-lg font-bold mb-2">Inbox : Shuaib</h2>
      <div className="h-96 overflow-y-auto border p-2 bottom-0">
        <div className="flex flex-col gap-2">
          {messages.map((msg, index) => (
            <Chatbubble 
              key={index} 
              message={msg.message} 
              timestamp={msg.timestamp} 
              isSender={msg.sender_id === userId} // ✅ Dynamically set alignment
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="mt-2 flex">
      <form onSubmit={handleSubmit} className="flex w-full bottom-0">
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
