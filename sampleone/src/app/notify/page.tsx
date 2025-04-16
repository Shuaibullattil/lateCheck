"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MenuButton from "../components/user/menubutton";
import { formatDateToDdMmYyyy } from "@/utils/formattime";

export default function Notify() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<{ message: string; timestamp: string }[]>([]);

    useEffect(() => {
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
        <div className="h-screen">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 w-full bg-green-600 shadow-xl p-4 z-50">
                <h1 className="text-left text-xl text-white font-bold">LateCheck</h1>
            </header>

            {/* Main Content */}
            <main className="grid grid-cols-6 flex-1 overflow-y-auto pt-16 pb-20 px-4">
                <div className="col-span-6 text-center py-4">
                    <h1 className="text-gray-400 font-black text-3xl">Notifications</h1>
                </div>

                {/* Notifications */}
                {notifications.length === 0 ? (
                    <div className="col-span-6 flex justify-center items-center">
                        <p className="text-gray-400">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((note, index) => (
                        <div
                            key={index}
                            className="col-span-6 flex justify-center my-2"
                        >
                            <div className="bg-green-200 rounded-md p-4 shadow-md w-full max-w-md">
                                <div className="text-gray-800 text-lg mb-2">{note.message}</div>
                                <div className="text-right text-sm text-gray-600">
                                    {formatDateToDdMmYyyy(note.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* Fixed Footer */}
            <footer className="fixed bottom-0 left-0 w-full shadow-md p-2 z-50 bg-white">
                <nav className="flex justify-around">
                    <MenuButton />
                </nav>
            </footer>
        </div>
    );
}
