"use client"
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import MenuButton from "../components/user/menubutton";
import Chatbubble from "../components/user/Chatbubble";


export default function notify(){

    const router = useRouter();
        const [user, setUser] = useState<any>(null); // Initially null to avoid hydration issues
    
        useEffect(() => {
            // Ensure localStorage access happens only on the client
            if (typeof window === "undefined") return;
    
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                router.replace("/"); // ✅ Use `replace` instead of `push` for instant redirection
            }
        }, [router]);
    
        // Prevent rendering until user state is determined
        if (!user) return null; 


    return(
        <div className="h-screen">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 w-full bg-green-600 shadow-xl p-4 z-50">
            <h1 className="text-left text-xl text-white font-bold">LateCheck</h1>
        </header>

        {/* Main Content (Scrollable) */}
        <main className="grid grid-cols-6 flex-1 overflow-y-auto pt-16 pb-16 px-4">
            {/* Page content goes here */}
            <div className="flex col-span-6 justify-center items-center">
                <h1 className="text-gray-400 font-black text-3xl py-4">Chat</h1>
            </div>
        </main>

        {/* Fixed Footer Navigation */}
        <footer className="flex justify-center fixed bottom-0 left-0 w-full shadow-md p-2 z-50">
            <div className="flex justify-center items-center gap-2 p-2 bg-gray-200 rounded-xl w-full max-w-md">
                {/* Input Field */}
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                
                {/* Send Button */}
                <button className="flex items-center justify-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                    <img src="/send-icon.svg" alt="Send" className="h-6 w-6" />
                </button>
            </div>

        </footer>
    </div>
    );
}