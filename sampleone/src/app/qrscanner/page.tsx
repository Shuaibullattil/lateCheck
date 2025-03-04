"use client"
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import MenuButton from "../components/user/menubutton";
import QrReader from "../components/Qrreader";

export default function Myscanner(){

    const router = useRouter();
    const [user, setUser] = useState<unknown>(null); // Initially null to avoid hydration issues

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
                <div className="flex py-10 col-span-6 justify-center items-center">
                    <QrReader />
                </div>
            </main>

            {/* Fixed Footer Navigation */}
            <footer className="fixed bottom-0 left-0 w-full shadow-md p-2 z-50">
                <nav className="flex justify-around">
                <MenuButton />
                </nav>
            </footer>
        </div>
    );
}