"use client"
import React from "react";
import MenuButton from "../components/user/menubutton";
import Profilecard from "../components/user/Profilecard"
import Profiletable from "../components/user/Profiletable"

export default function profile(){
    return(

            <div className="h-screen">
                {/* Fixed Header */}
                <header className="fixed top-0 left-0 w-full bg-green-600 shadow-xl p-4 z-50">
                    <h1 className="text-left text-xl text-white font-bold">LateCheck</h1>
                </header>

                {/* Main Content (Scrollable) */}
                <main className="grid grid-cols-6 flex-1 overflow-y-auto pt-16 pb-16 px-4">
                    {/* Page content goes here */}
                    <div className="flex col-span-6 items-center justify-center">
                        <Profilecard />
                    </div>
                    <div className="flex col-span-6 items-center justify-center">
                        <Profiletable />
                    </div>
                </main>

                {/* Fixed Footer Navigation */}
                <footer className="fixed bottom-0 left-0 w-full shadow-md p-2 z-50">
                    <nav className="flex justify-around">
                    <MenuButton />
                    </nav>
                </footer>
            </div>

    )
}