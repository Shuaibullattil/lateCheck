"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  ArrowLeft
} from "lucide-react";
import Inbox from "../../components/Inbox";
import Chat from "../../components/Chat";
import axios from "axios";

const handleLogout = () => {
  localStorage.removeItem("warden")
};
// Updated to include actual paths
const sidebarItems = [
  { name: "Dashboard", icon: BarChart3, href: "/dashboard/analytics" },
  { name: "Student Details", icon: Users, href: "/studentdetail" },
  { name: "Requests", icon: FileText, href: "/dashboard/student-request" },
  { name: "Messages", icon: MessageSquare, href: "/dashboard/student-messages" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
  { name: "Logout", icon: LogOut, href: "/" },
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
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [receiverId, setReceiverId] = useState("");
  const [userId, setUserId] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  // Auth check
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("warden");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.usertype !== "warden") {
          router.replace("/");
        } else {
          setUser(parsedUser);
          setUserId(parsedUser.email);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.replace("/");
      }
    } else {
      router.replace("/");
    }

    setIsCheckingAuth(false);
  }, [router]);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowChat(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch messages on mount - only when userId is available
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return; // Don't fetch if userId is not set
      
      try {
        const response = await axios.get<Message[]>(`http://localhost:8000/inbox/${userId}`);
        setMessages(response.data);
        setFilteredMessages(response.data); // Initialize filtered messages with all messages
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId]);

  // Fetch chat history when a receiver is selected
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!userId || !receiverId) return; // Don't fetch if either userId or receiverId is missing
      
      try {
        const response = await axios.get<Message[]>(`http://localhost:8000/messages/${userId}/${receiverId}`);
        setChatMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (receiverId) {
      fetchChatHistory();
    }
  }, [receiverId, userId]);

  // WebSocket setup - only when userId is available
  // Fixed to only depend on userId, not receiverId
  useEffect(() => {
    if (!userId) return; // Don't connect WebSocket if userId is not set
    
    console.log("Creating new WebSocket connection for:", userId);
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    ws.onopen = () => {
      console.log("WebSocket connected successfully for:", userId);
    };

    ws.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      console.log("Received message:", newMessage);

      // Update inbox messages
      setMessages((prevMessages) => {
        const existingMessageIndex = prevMessages.findIndex(
          (msg) => msg.sender_id === newMessage.sender_id
        );

        let updatedMessages;
        if (existingMessageIndex >= 0) {
          updatedMessages = [...prevMessages];
          updatedMessages[existingMessageIndex] = newMessage;
        } else {
          updatedMessages = [...prevMessages, newMessage];
        }
        
        // Update filtered messages accordingly
        setFilteredMessages((prevFiltered) => {
          // If we're not filtering, just update with all messages
          if (prevFiltered.length === prevMessages.length) {
            return updatedMessages;
          }
          // Otherwise, reapply the current filter logic
          const input = document.querySelector('input[placeholder="Search messages..."]') as HTMLInputElement;
          const searchTerm = input?.value.toLowerCase() || '';
          
          return updatedMessages.filter(message => 
            message.sender_name.toLowerCase().includes(searchTerm)
          );
        });
        
        return updatedMessages;
      });

      // Check if this message belongs to the current active chat
      if ((newMessage.sender_id === receiverId && newMessage.receiver_id === userId) ||
          (newMessage.sender_id === userId && newMessage.receiver_id === receiverId)) {
        console.log("Adding message to current chat");
        setChatMessages((prev) => [...prev, newMessage]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = (event) => {
      console.log(`WebSocket Disconnected with code: ${event.code}, reason: ${event.reason}`);
    };

    // Add a ping mechanism to keep the connection alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Every 30 seconds

    return () => {
      console.log("Cleaning up WebSocket connection");
      clearInterval(pingInterval);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [userId]); // Only depend on userId, not receiverId

  const handleMessageClick = (message: Message) => {
    console.log("Selected message from:", message.sender_id);
    setReceiverId(message.sender_id);
    // On mobile, show chat view when a message is selected
    if (window.innerWidth < 768) {
      setShowChat(true);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') {
      // If search is empty, show all messages
      setFilteredMessages(messages);
    } else {
      // Filter messages by sender name
      const filtered = messages.filter(message => 
        message.sender_name.toLowerCase().includes(searchTerm)
      );
      setFilteredMessages(filtered);
    }
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
                onClick={name === "Logout" ? handleLogout : undefined}
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
            <h2 className="text-2xl font-bold text-green-800 ml-4 md:ml-2">Welcome {user?.name || ""}!</h2>
          </div>
        </header>

        <main className="p-3 sm:p-4 md:p-6 flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="w-full flex flex-col md:flex-row gap-4">
              {/* Inbox Container - Hidden on mobile when chat is shown */}
              <div className={`bg-white rounded-xl border border-green-400 shadow-xl px-4 py-4 md:px-6 md:py-6 w-full md:w-1/3 max-h-[80vh] overflow-y-auto transition-all duration-300 ${showChat ? 'hidden md:block' : 'block'}`}>
                {/* Search bar replacing the "Messages" header */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full py-2 px-4 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onChange={handleSearch}
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {filteredMessages.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No messages found</p>
                ) : (
                  filteredMessages.map((message, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleMessageClick(message)}
                      className="w-full"
                    >
                      <Inbox message={message} />
                    </button>
                  ))
                )}
              </div>
              
              {/* Chat Container */}
              <div className={`flex justify-center items-start w-full md:w-2/3 transition-all duration-300 ${!showChat && receiverId === "" ? 'hidden md:block' : (showChat ? 'flex' : 'hidden md:flex')}`}>
                {/* Back button for mobile - moved to top of chat with better positioning */}
                {showChat && (
                  <div className="w-full relative">
                    <button 
                      onClick={() => setShowChat(false)}
                      className="absolute top-4 left-4 bg-green-100 p-2 rounded-full md:hidden z-10"
                      aria-label="Back to inbox"
                    >
                      <ArrowLeft className="h-5 w-5 text-green-800" />
                    </button>
                    <Chat userId={userId} receiverId={receiverId} initialMessages={chatMessages} />
                  </div>
                )}
                
                {!showChat && (
                  <div className="w-full">
                    <Chat userId={userId} receiverId={receiverId} initialMessages={chatMessages} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}