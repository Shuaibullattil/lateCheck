"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const Timer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date();
    target.setHours(23, 0, 0, 0);
    if (now > target) target.setDate(target.getDate() + 1);

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeKeys = ["hours", "minutes", "seconds"];

  return (
    <div className="w-full p-3 rounded-xl">
      <div className="flex justify-center gap-6 md:gap-8">
        {timeKeys.map((unit) => (
          <div
            key={unit}
            className="bg-[#f1fdf3] border border-green-100 rounded-xl px-4 py-4 shadow-sm flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <p className="text-3xl font-bold text-green-900">
              {timeLeft[unit].toString().padStart(2, "0")}
            </p>
            <span className="text-xs text-green-700 uppercase tracking-wider">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timer;
