"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import SideBar from '../components/sidebar';
import LateEntryTable from '../components/LateEntryTable';
import PendingTable from '../components/PendingTable';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
const weekDay = daysOfWeek[today.getDay()];

const now = new Date();
let hours = now.getHours();
const minutes = now.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;
const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedUser = localStorage.getItem("warden");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Redirect if not a warden
            if (parsedUser.usertype !== "warden") {
                router.replace("/");
            }
        } else {
            router.replace("/");
        }
    }, [router]);

    if (!user || user.usertype !== "warden") return null;

    return (
        <div>
            <div className='grid grid-cols-12 bg-slate-400 '>
                <div className=' prose items-center col-span-6 ml-8 mt-4 mb-4'>
                    <h1 className='m-0 text-white'>DashBoard</h1>
                    <h5 className='m-0 text-white'>{weekDay} | {formattedTime}</h5>
                </div>
                <div className='flex col-span-6 justify-end items-center'>
                    <h2 className='text-white px-4 text-xl font-black'>{user.name}</h2>
                </div>
            </div>
            <div className='grid grid-cols-12'>
                <div className='sm:col-span-2 hidden md:block bg-base-300 h-100vw'>
                    <SideBar />
                </div>
                <div className='sm:col-span-1 hidden'></div>
                <div className='sm:col-span-10 col-span-12 bg-white mt-16 ml-10'>
                    <div className='grid grid-cols-9 gap-4 justify-start pr-8'>
                        <div className='col-span-9 sm:col-span-4 border shadow-xl '>
                            <LateEntryTable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
