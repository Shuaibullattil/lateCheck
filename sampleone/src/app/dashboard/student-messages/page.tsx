"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../../components/sidebar";
import Chat from "../../components/Chat";
import Inbox from "../../components/Inbox";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
const weekDay = daysOfWeek[today.getDay()];

const now = new Date();
let hours = now.getHours();
const minutes = now.getMinutes();
const ampm = hours >= 12 ? "PM" : "AM";
hours = hours % 12 || 12;
const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;

type Message = {
  sender_name: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  timestamp: string;
};

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiverId, setReceiverId] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const userId = "saharawardenofficial@gmail.com"; // Hardcoded for now

  // Function to fetch initial messages (only once)
  const fetchMessages = async () => {
    try {
      const response = await axios.get<Message[]>(`http://localhost:8000/inbox/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to fetch chat history when receiver is selected
  const fetchChatHistory = async (receiverId: string) => {
    try {
      const response = await axios.get<Message[]>(`http://localhost:8000/messages/${userId}/${receiverId}`);
      setChatMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    fetchMessages(); // Fetch messages only once at the start
  }, []);

  useEffect(() => {
    if (receiverId) {
      fetchChatHistory(receiverId);
    }
  }, [receiverId]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    ws.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      
      // Update inbox messages
      setMessages((prevMessages) => {
        // Check if we already have a message from this sender
        const existingMessageIndex = prevMessages.findIndex(
          msg => msg.sender_id === newMessage.sender_id
        );
        
        if (existingMessageIndex >= 0) {
          // Update existing message
          const updatedMessages = [...prevMessages];
          updatedMessages[existingMessageIndex] = newMessage;
          return updatedMessages;
        } else {
          // Add new message
          return [...prevMessages, newMessage];
        }
      });

      // If the message is for the current chat, update chat messages
      if (receiverId && (newMessage.sender_id === receiverId || newMessage.receiver_id === receiverId)) {
        setChatMessages((prev) => [...prev, newMessage]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [receiverId]);

  const handleMessageClick = (message: Message) => {
    setReceiverId(message.sender_id);
  };

  return (
    <div>
      <div className="grid grid-cols-12 bg-slate-400">
        <div className="prose items-center col-span-12 ml-8 mt-4 mb-4">
          <h1 className="m-0 text-white">Student Messages</h1>
          <h5 className="m-0 text-white">{weekDay} | {formattedTime}</h5>
        </div>
      </div>
      <div className="grid grid-cols-12">
        <div className="sm:col-span-2 hidden md:block bg-base-300 h-100vw">
          <SideBar />
        </div>
        <div className="col-span-6 sm:col-span-4 h-100vw bg-neutral-200 px-8 py-8">
          {messages.map((message, index) => (
            <button key={index} onClick={() => handleMessageClick(message)}>
              <Inbox message={message} />
            </button>
          ))}
        </div>
        <div className="flex col-span-6 justify-center items-start bg-white">
          <Chat userId={userId} receiverId={receiverId} initialMessages={chatMessages} />
        </div>
      </div>
    </div>
  );
}
