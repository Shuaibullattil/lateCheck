// pages/dashboard.tsx
import React from 'react';
import SideBar from '../components/sidebar';

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
        <div className='flex'>
            <div className='flex-none w-80'>
                <SideBar />
            </div >
            <div className='flex-1 bg-neutral h-28'>
                <div className='prose p-5'>
                    <h1 className='m-0 text-white'>{weekDay}</h1>
                    <h3 className='m-0 text-white'>{formattedTime}</h3>
                </div>
            </div>
        </div>
        
    );
}
