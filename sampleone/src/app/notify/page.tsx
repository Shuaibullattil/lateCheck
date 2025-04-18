"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MenuButton from "../components/user/menubutton";
import { formatDateToDdMmYyyy } from "@/utils/formattime";
import { 
  CheckCircle, X, Filter, 
  ChevronDown, Search, Send, Plus, Users, 
  Calendar, Megaphone, Bookmark, ChevronRight,ArrowLeft,Bell
} from "lucide-react";

// Category options with nice labels and colors
  const notificationTypes = [
    { id: "all", label: "All Notifications", icon: Bell, color: "bg-blue-100 text-blue-800" },
    { id: "announcement", label: "Announcements", icon: Megaphone, color: "bg-orange-100 text-orange-800" },
    { id: "system", label: "System", icon: Bell, color: "bg-pink-100 text-pink-800" },
    { id: "report", label: "Reports", icon: Bookmark, color: "bg-indigo-100 text-indigo-800" },
  ];

  const getTypeIcon = (type) => {
    const found = notificationTypes.find(t => t.id === type);
    const Icon = found?.icon || Bell;
    return <Icon className="h-5 w-5" />;
  };

  const getTypeColor = (type) => {
    const found = notificationTypes.find(t => t.id === type);
    return found ? found.color : "bg-gray-100 text-gray-800";
  };

export default function Notify() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<{ message: string; timestamp: string }[]>([]);

    useEffect(() => {
        console.log("Mounted");
        if (typeof window === "undefined") return;

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.replace("/");
        }
    }, [router]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:8000/notifications/all");
                if (res.data.success) {
                    setNotifications(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };
    
        fetchNotifications(); // Initial fetch on mount
    
        const interval = setInterval(fetchNotifications, 2000); // Refresh every 2 seconds
    
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);
    

    if (!user) return null;

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
              <div className="text-green-700 font-bold text-xl">Notifications</div>
            </div>
          </header>
    
          {/* Spacer to avoid overlap with header */}
          <div className="h-20" />
    
          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-8 max-w-3xl w-full mx-auto pb-6">
            <div className="bg-white rounded-3xl border border-green-300 shadow-lg overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-green-100">
                <Bell className="text-green-600 h-6 w-6" />
                <h2 className="text-lg font-semibold text-green-800">Latest Notices</h2>
              </div>
    
              {/* Notifications list */}
              <div className="max-h-[450px] overflow-y-auto p-4 space-y-4">
                {notifications.map((note, index) => (
                  <div
                    key={index}
                    className="bg-[#f1fdf3] border border-green-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                  ><div className="flex gap-2">
                      <div className={`p-1.5 rounded-lg h-8 ${getTypeColor(note.type)}`}>
                      {getTypeIcon(note.type)}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{note.message}</p>
                    
                  </div>
                    <p className="text-xs text-gray-400 mt-2 italic text-right">{formatDateToDdMmYyyy(note.timestamp)}</p>
                    
                  </div>
                ))}
              </div>
            </div>
          </main>
                <footer className="fixed bottom-0 left-0 w-full p-3 z-50">
                  <div className="flex justify-center">
                    <MenuButton />
                  </div>
             </footer>
        </div>
      );
}







