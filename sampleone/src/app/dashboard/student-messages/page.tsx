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

// Updated to include actual paths
const sidebarItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Student Details", icon: Users, href: "/studentdetail" },
  { name: "Responses", icon: FileText, href: "/dashboard/student-request" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { name: "Messages", icon: MessageSquare, href: "/dashboard/student-messages" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
  { name: "Logout", icon: LogOut, href: "/logout" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  
  
      useEffect(() => {
          if (typeof window === "undefined") return;
  
          const storedUser = localStorage.getItem("warden");
          if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
  
              // Redirect if not a warden
              if (parsedUser.usertype !== "warden") {
                  router.replace("/");
              }
          } else {
              router.replace("/");
          }
      }, [router]);
  
      if (!user || user.usertype !== "warden") return null;
   // to detect the current path

   

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
        <div className="grid grid-cols-12">
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
        </main>
      </div>
    </div>
  );
}
