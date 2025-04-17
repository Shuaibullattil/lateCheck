"use client";

import { usePathname } from "next/navigation";
import { Home, BarChart, Users, MessageSquare, Bell, LogOut } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: <Home /> },
  { name: "Student Details", href: "/students", icon: <Users /> },
  { name: "Analytics", href: "/analytics", icon: <BarChart /> },
  { name: "Messages", href: "/messages", icon: <MessageSquare /> },
  { name: "Notifications", href: "/notifications", icon: <Bell /> },
  { name: "Logout", href: "/logout", icon: <LogOut /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white shadow-md border-r border-green-100 w-64 fixed h-full top-0 left-0 z-50 flex flex-col">
      <div className="px-6 py-6 border-b border-green-100">
        <h2 className="text-2xl font-bold text-green-700">LateCheck</h2>
      </div>
      <nav className="flex flex-col gap-2 px-4 pt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-green-50 ${
                isActive ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700"
              }`}
            >
              <div className="w-5 h-5">{item.icon}</div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
