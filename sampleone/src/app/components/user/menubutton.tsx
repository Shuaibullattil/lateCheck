"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Bell,
  QrCode,
  MessageCircle,
  User as UserIcon,
} from "lucide-react";

const navItems = [
  { href: "/home", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/notify", label: "Notices", icon: <Bell className="h-5 w-5" /> },
  { href: "/qrscanner", label: "Scan", icon: <QrCode className="h-5 w-5" /> },
  { href: "/chat", label: "Chat", icon: <MessageCircle className="h-5 w-5" /> },
  { href: "/profile", label: "Profile", icon: <UserIcon className="h-5 w-5" /> },
];

const MenuButton = () => {
  const pathname = usePathname();

  return (
    <div className="w-full fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-green-200 shadow-xl rounded-full px-4 py-2 flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-all ${
              pathname === item.href
                ? "bg-[#f1fdf3] text-green-800 font-semibold"
                : "text-gray-500 hover:text-green-700"
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MenuButton;
