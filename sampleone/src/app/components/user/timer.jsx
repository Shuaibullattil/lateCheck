"use client";
import React, { useState, useEffect } from "react";

const Timer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const target = new Date();

    target.setHours(23, 0, 0, 0); // Set target time to 11 PM

    // If it's already past 11 PM, set the target to the next day's 11 PM
    if (now > target) {
      target.setDate(target.getDate() + 1);
    }

    const diff = target - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-6 prose">
      <div className=" flex col-span-2 justify-center items-center">
        <h2 className="bg-neutral text-white p-3 rounded-md m-0 pl-2">{timeLeft.hours} <span className="text-xs">Hour</span></h2>
      </div>
      <div className="flex col-span-2 justify-center items-center">
        <h2 className="bg-neutral text-white p-3 rounded-md m-0 pl-2">{timeLeft.minutes} <span className="text-xs">Min</span></h2>
      </div>
      <div className="flex col-span-2 justify-center items-center">
        <h2 className="bg-neutral text-white p-3 rounded-md m-0 pl-2">{timeLeft.seconds} <span className="text-xs">Sec</span></h2>
      </div>
    </div>
  );
};

export default Timer;
