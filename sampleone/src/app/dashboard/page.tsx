// pages/dashboard.tsx
import React from 'react';
import SideBar from '../components/sidebar';
import LateEntryTable from '../components/LateEntryTable';
import PendingTable from '../components/PendingTable';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
const weekDay = daysOfWeek[today.getDay()];

const now = new Date();
let hours = now.getHours(); // Get the hour (0-23)
const minutes = now.getMinutes(); // Get the minutes (0-59)

// Determine AM/PM
const ampm = hours >= 12 ? 'PM' : 'AM';

// Convert to 12-hour format
hours = hours % 12;
hours = hours ? hours : 12; // Handle the case when hours == 0 (midnight)

// Format minutes to always show two digits
const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;


export default function Dashboard() {
    return (
        <div>
            <div className='grid grid-cols-12 bg-slate-400 '>
                <div className=' prose items-center col-span-12 ml-8 mt-4 mb-4'>
                    <h1 className='m-0 text-white'>DashBoard</h1>
                    <h5 className='m-0 text-white'>{weekDay} | {formattedTime}</h5>
                </div>
            </div>
            <div className='grid grid-cols-12'>
                <div className='sm:col-span-2 hidden md:block bg-base-300 h-100vw'>
                    <SideBar />
                </div>
                <div className='sm:col-span-1 hidden'>

                </div>
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
