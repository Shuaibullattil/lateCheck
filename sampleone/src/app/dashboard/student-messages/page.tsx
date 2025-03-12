// pages/dashboard.tsx
import React from 'react';
import SideBar from '../../components/sidebar';
import Chat from '../../components/Chat'

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
                    <h1 className='m-0 text-white'>Student Messages</h1>
                    <h5 className='m-0 text-white'>{weekDay} | {formattedTime}</h5>
                </div>
            </div>
            <div className='grid grid-cols-12'>

                <div className='sm:col-span-2 hidden md:block bg-base-300 h-100vw'>
                    <SideBar />
                </div>

                <div className='col-span-6 sm:col-span-4 h-100vw bg-neutral-200 px-8 py-8'>
                    <div className='grid grid-cols-5 h-20 bg-white my-2 hover:bg-blue-300'>
                        <div className='flex col-span-1  justify-center items-center'>
                        <div className="avatar">
                                <div className="w-16 rounded-full">
                                    <img src="https://i.pinimg.com/474x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg" />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col col-span-3  justify-center items-center px-4'>
                            <div className='flex w-full justify-start items-end'>
                                <p className='text-lg font-bold'>Shuaib Ullattil</p>
                    </div>
                            <div className='flex w-full justify-start items-start'>
                                <p className='text-xs font-medium text-gray-500'>i was late due to rain</p>
                    </div>

                        </div>
                        <div className='flex flex-col col-span-1  justify-center items-center pr-4'>
                            <div className="text-right">
                                <p className="text-xl font-bold">12:00</p>
                                <p className="text-xs font-semibold uppercase text-gray-600">10 Mar 2025</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' flex col-span-6 justify-center items-center bg-white'>
                <Chat userId="saharawardenofficial@gmail.com" receiverId="shuaibullattil7768@gmail.com" />
                </div>

            </div>
        </div>
        
    );
}
