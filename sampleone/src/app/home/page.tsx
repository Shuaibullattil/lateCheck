"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuButton from "../components/user/menubutton";
import Timer from "../components/user/timer";
import Abouthostel from "../components/user/Abouthostel";
import { Clock } from "lucide-react";

const menuByDay = {
  Sunday: [
    { name: "Appam & Stew", emoji: "🥞", type: "Breakfast", kcal: 420, spice: 1 },
    { name: "Kerala Sadya", emoji: "🥗", type: "Lunch", kcal: 780, spice: 1 },
    { name: "Parotta & Beef", emoji: "🥩", type: "Dinner", kcal: 900, spice: 3 },
  ],
  Monday: [
    { name: "Idli & Sambar", emoji: "🍛", type: "Breakfast", kcal: 360, spice: 1 },
    { name: "Rice & Fish Curry", emoji: "🐟", type: "Lunch", kcal: 710, spice: 2 },
    { name: "Chappathi & Kadala", emoji: "🌮", type: "Dinner", kcal: 620, spice: 2 },
  ],
  Tuesday: [
    { name: "Dosa & Chutney", emoji: "🥞", type: "Breakfast", kcal: 400, spice: 1 },
    { name: "Kootu Curry & Rice", emoji: "🍲", type: "Lunch", kcal: 690, spice: 1 },
    { name: "Puttu & Kadala", emoji: "🌾", type: "Dinner", kcal: 650, spice: 2 },
  ],
  Wednesday: [
    { name: "Uttapam", emoji: "🍳", type: "Breakfast", kcal: 410, spice: 1 },
    { name: "Curd Rice & Pickle", emoji: "🍚", type: "Lunch", kcal: 670, spice: 0 },
    { name: "Upma & Banana", emoji: "🍌", type: "Dinner", kcal: 580, spice: 1 },
  ],
  Thursday: [
    { name: "Poha", emoji: "🥣", type: "Breakfast", kcal: 390, spice: 1 },
    { name: "Rice & Sambar", emoji: "🍛", type: "Lunch", kcal: 720, spice: 1 },
    { name: "Chapathi & Egg Curry", emoji: "🍳", type: "Dinner", kcal: 750, spice: 2 },
  ],
  Friday: [
    { name: "Vellayappam & Egg", emoji: "🍳", type: "Breakfast", kcal: 440, spice: 2 },
    { name: "Biriyani", emoji: "🍗", type: "Lunch", kcal: 880, spice: 3 },
    { name: "Idiyappam & Veg Kurma", emoji: "🥘", type: "Dinner", kcal: 640, spice: 2 },
  ],
  Saturday: [
    { name: "Medu Vada & Chutney", emoji: "🍩", type: "Breakfast", kcal: 370, spice: 1 },
    { name: "Rice & Moru Curry", emoji: "🥛", type: "Lunch", kcal: 680, spice: 1 },
    { name: "Dosa & Tomato Chutney", emoji: "🌯", type: "Dinner", kcal: 630, spice: 2 },
  ],
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const menu = menuByDay[today as keyof typeof menuByDay] || [];

  return (
    <div className="min-h-screen bg-[#f1fdf3] text-gray-800 flex flex-col">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 h-[64px]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between h-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">LateCheck</h1>
          <span className="text-gray-600 text-sm">Welcome Back, {user?.name}!</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-[calc(100vh-650px)] px-4 sm:px-8 overflow-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
          {/* Left Column */}
          <div className="flex flex-col justify-between">
            <div className="bg-white shadow-xl rounded-2xl px-6 py-6 border border-green-400">
              <Abouthostel hostel={user?.details?.hostel} />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4">
            {/* Timer */}
            <div className="bg-white shadow-lg rounded-2xl p-6  border border-green-400">
              <div className="flex items-center gap-2 text-green-800 text-2xl font-bold mb-3">
                <Clock className="h-6 w-6 text-green-800" /> {/* Clock Icon */}
                <span>Gate Closes in</span>
              </div>
              <Timer />
            </div>

            {/* Food Menu */}
            <div className="border bg-white border-green-400 shadow-md rounded-xl p-6 space-y-4 transition-all duration-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-1">Today's Menu</h2>
                <p className="text-gray-600 text-sm">{today}'s meals • Served hot at 12 PM 🍽️</p>
                <p className="text-gray-400 text-xs italic mt-1">Men’s Hostel Mess</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {menu.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-[#f1fdf3] border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-2 flex flex-col items-center justify-center hover:scale-[1.02]"
                  >
                    <div className="text-3xl mb-1 transition-transform group-hover:scale-110">
                      {item.emoji}
                    </div>
                    <h3 className="text-md font-semibold text-green-800 text-center">{item.name}</h3>
                    <span className="text-xs text-white bg-green-500 rounded-full px-2 py-0.5 mt-1">{item.type}</span>
                    <p className="text-sm text-gray-600 mt-2">{item.kcal} kcal</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-3 z-50">
        <div className="flex justify-center">
          <MenuButton />
        </div>
      </footer>
    </div>
  );
}
