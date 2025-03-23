"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../components/sidebar';
import Chat from '../../components/Chat';
import Inbox from '../../components/Inbox';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
const weekDay = daysOfWeek[today.getDay()];

const now = new Date();
let hours = now.getHours();
const minutes = now.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;
const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

type Message = {
    sender_name: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    timestamp: string;
};

export default function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([]);

    // Function to fetch messages
    const fetchMessages = async () => {
        try {
            const response = await axios.get<Message[]>('http://localhost:8000/inbox/saharawardenofficial@gmail.com');
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages(); // Initial fetch
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div>
            <div className='grid grid-cols-12 bg-slate-400'>
                <div className='prose items-center col-span-12 ml-8 mt-4 mb-4'>
                    <h1 className='m-0 text-white'>Student Messages</h1>
                    <h5 className='m-0 text-white'>{weekDay} | {formattedTime}</h5>
                </div>
            </div>
            <div className='grid grid-cols-12'>
                <div className='sm:col-span-2 hidden md:block bg-base-300 h-100vw'>
                    <SideBar />
                </div>
                <div className='col-span-6 sm:col-span-4 h-100vw bg-neutral-200 px-8 py-8'>
                    {messages.map((message, index) => (
                        <Inbox key={index} message={message} />
                    ))}
                </div>
                <div className='flex col-span-6 justify-center items-start bg-white'>
                    <Chat userId="saharawardenofficial@gmail.com" receiverId="shuaibullattil7768@gmail.com" />
                </div>
            </div>
        </div>
    );
}
