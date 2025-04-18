"use client";

import { useEffect, useState } from "react";
import { usePathname,useRouter } from "next/navigation";
import Link from "next/link";

import {
  Menu,
  X,
  Home,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Bell,
  LogOut,
} from "lucide-react";
import Inbox from "../../components/Inbox";
import Chat from "../../components/Chat";
import axios from "axios";

// Updated to include actual paths
const sidebarItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Student Details", icon: Users, href: "/studentdetail" },
  { name: "Requests", icon: FileText, href: "/dashboard/student-request" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { name: "Messages", icon: MessageSquare, href: "/dashboard/student-messages" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
  { name: "Logout", icon: LogOut, href: "/logout" },
];


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
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const userId = "saharawardenofficial@gmail.com"; // Hardcoded for now
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

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>(`http://localhost:8000/inbox/${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId]);

  // Fetch chat history when a receiver is selected
  useEffect(() => {
    const fetchChatHistory = async (receiverId: string) => {
      try {
        const response = await axios.get<Message[]>(`http://localhost:8000/messages/${userId}/${receiverId}`);
        setChatMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (receiverId) {
      fetchChatHistory(receiverId);
    }
  }, [receiverId, userId]);

  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    ws.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);

      setMessages((prevMessages) => {
        const existingMessageIndex = prevMessages.findIndex(
          (msg) => msg.sender_id === newMessage.sender_id
        );

        if (existingMessageIndex >= 0) {
          const updatedMessages = [...prevMessages];
          updatedMessages[existingMessageIndex] = newMessage;
          return updatedMessages;
        } else {
          return [...prevMessages, newMessage];
        }
      });

      if (
        receiverId &&
        (newMessage.sender_id === receiverId || newMessage.receiver_id === receiverId)
      ) {
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
  }, [receiverId, userId]);

  const handleMessageClick = (message: Message) => {
    setReceiverId(message.sender_id);
  };

 
  if (isCheckingAuth) return null;

  return (
    <div className="h-screen flex bg-[#f1fdf3] text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 bg-white border-r border-green-200 w-64 space-y-4 py-6 px-4 overflow-y-auto z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <button className="absolute top-4 right-4 md:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="text-green-700" />
        </button>
        <h1 className="text-xl font-bold text-green-800 mb-4">LateCheck</h1>

        <nav className="flex flex-col gap-1">
          {sidebarItems.map(({ name, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 text-left ${
                  isActive
                    ? "bg-green-200 text-green-800"
                    : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-md p-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="text-green-700" />
            </button>
            <h2 className="text-2xl font-bold text-green-800 ml-4 md:ml-2">Welcome {user.name}!</h2>
          </div>
        </header>

        <main className="p-3 sm:p-4 md:p-6 flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto">
        <div className="w-full flex gap-2">
        <div className=" max-h-[80vh] overflow-y-auto  bg-white rounded-xl border-1 border border-green-400 shadow-xl px-8 py-8 w-1/3">
          {messages.map((message, index) => (
            <button key={index} onClick={() => handleMessageClick(message)}>
              <Inbox message={message} />
            </button>
          ))}
        </div>
        <div className="flex  justify-center items-start w-2/3">
          <Chat userId={userId} receiverId={receiverId} initialMessages={chatMessages} />
        </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
