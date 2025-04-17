"use client";
import axios from "axios"; 
import React, { useState, useEffect } from 'react';
import SideBar from '../components/sidebar';
import { formatDateToDdMmYyyy } from "@/utils/formattime";
import { useRouter } from "next/navigation";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
const weekDay = daysOfWeek[today.getDay()];

const now = new Date();
let hours = now.getHours();
const minutes = now.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;
const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

export default function Dashboard() {

    const [user, setUser] = useState<any>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const router = useRouter();

    // Auth check
      useEffect(() => {
        if (typeof window === "undefined") return;
    
        const storedUser = localStorage.getItem("warden");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.usertype !== "warden") {
            router.replace("/");
          } else {
            setUser(parsedUser);
          }
        } else {
          router.replace("/");
        }
    
        setIsCheckingAuth(false);
      }, [router]);


    // ✅ messages now stores full message objects
    const [messages, setMessages] = useState<{ message: string; timestamp: string }[]>([]);
    const [input, setInput] = useState('');

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:8000/notifications/all");
            if (res.data.success) {
                setMessages(res.data.data.reverse());
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const sendMessage = async () => {
        if (input.trim() === "") return;
    
        const timestamp = new Date().toISOString();
    
        try {
            const response = await axios.post("http://localhost:8000/notifications/create", {
                message: input,
                sender_id: "saharawardenofficial@gmail.com",
                timestamp: timestamp,
            });
    
            if (response.data.success) {
                // ✅ Store the raw object instead of formatted string
                setMessages((prevMessages) => [
                    { message: input, timestamp },
                    ...prevMessages,
                ]);
                setInput('');
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Top Bar */}
            <div className='grid grid-cols-12 bg-slate-400 p-4'>
                <div className='prose items-center col-span-12'>
                    <h1 className='text-white'>Student Notification</h1>
                    <h5 className='text-white'>{weekDay} | {formattedTime}</h5>
                </div>
                <div className='flex col-span-6 justify-end items-center'>
                    <h2 className='text-white px-4 text-xl font-black'>{user?.name}</h2>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
                <div className='sm:col-span-2 hidden md:block bg-base-300'>
                    <SideBar />
                </div>

                <div className='sm:col-span-10 col-span-12 flex flex-col mt-8 bg-white w-[1200px] h-[500px] mx-auto border rounded-lg shadow-md'>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 h-[400px]">
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-center">No messages yet</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="mb-2 p-2 bg-gray-200 rounded-md">
                                    <p className="text-left">{msg.message}</p>
                                    <p className="text-right text-sm text-gray-500">
                                        {formatDateToDdMmYyyy(msg.timestamp)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Box */}
                    <div className="p-2 bg-gray-100 flex">
                        <input
                            type='text'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className='flex-1 p-2 border rounded-md'
                            placeholder='Type a message...'
                        />
                        <button 
                            onClick={sendMessage}
                            className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
