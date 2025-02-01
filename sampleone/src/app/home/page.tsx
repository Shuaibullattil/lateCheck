import React from "react";
import MenuButton from "../components/user/menubutton";
import Timer from "../components/user/timer";
import Abouthostel from "../components/user/Abouthostel";

export default function home(){
    return(

            <div className="h-screen">
                {/* Fixed Header */}
                <header className="fixed top-0 left-0 w-full bg-green-600 shadow-xl p-4 z-50">
                    <h1 className="text-left text-xl text-white font-bold">LateCheck</h1>
                </header>

                {/* Main Content (Scrollable) */}
                <main className="grid grid-cols-6 flex-1 overflow-y-auto pt-16 pb-16 px-4">
                    {/* Page content goes here */}
                    <div className="col-span-6 my-2">
                        <Abouthostel />
                    </div>
                    <div className="col-span-6 my-4">
                        <h2 className="pl-1 text-lg text-gray-400 p-4 font-semibold">Hostel closes in</h2>
                        <Timer />
                    </div>
                    <div className="grid grid-cols-6 col-span-6 bg-green-800 h-24 rounded-lg prose shadow-sm my-4">
                        
                        <div className="col-span-6 text-center">
                            <h2 className="text-blue-50 mt-2 mb-0">Todays menu</h2>
                        </div>
                        <div className="col-span-2 text-white text-center">
                            <p className="font-thin m-2 leading-tight">Idili sambar</p>
                        </div>
                        <div className="col-span-2 text-white text-center">
                            <p className="font-thin m-2">Sadya</p>
                        </div>
                        <div className="col-span-2 text-white text-center">
                            <p className="font-thin m-2">Biriyani</p>
                        </div>
                        
                        
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