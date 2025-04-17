"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuButton from "../components/user/menubutton";
import QrReader from "../components/Qrreader";

export default function Myscanner() {
    const router = useRouter();
    const [user, setUser] = useState<unknown>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.replace("/");
        }
    }, [router]);

    if (!user) return null;

    return (
        <div className="flex flex-col min-h-screen bg-[#f1fdf3]">
            {/* Header */}
            <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
                    <div className="text-green-700 font-bold text-xl">LateCheck Scanner</div>
                </div>
            </header>

            {/* Spacer for header */}
            <div className="h-20" />

            {/* Main Content */}
            <main className="flex flex-col flex-1 px-4 sm:px-8 max-w-3xl w-full mx-auto pb-24">
                <div className="flex flex-col bg-white rounded-3xl shadow-lg border border-green-300 p-6 items-center justify-center">
                    <QrReader />
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 w-full bg-white shadow-inner p-3 z-50">
                <div className="flex justify-center">
                    <MenuButton />
                </div>
            </footer>
        </div>
    );
}
