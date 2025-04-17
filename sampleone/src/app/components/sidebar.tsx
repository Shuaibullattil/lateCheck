// components/sidebar.tsx
"use client"
import { useRouter } from 'next/navigation';
import React from 'react';


const SideBar = () => {

    const router = useRouter()

    const handleLogout = () =>{
        localStorage.removeItem("warden")
        router.replace("/")
    };

    return (
        <div className="drawer drawer-open">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <div className=''>
                    <div className='flex h-screen'>
                        <ul className="menu p-4  bg-base-300 text-base-content text-lg ">
                            <li><a href='/dashboard'>Dashboard</a></li>
                            <li><a href='/studentdetail'>Student Detail</a></li>
                            <li><a>Responses</a></li>
                            <li><a href='/dashboard/analytics'>Analytics</a></li>
                            <li><a href='/dashboard/student-messages'>Student Messages<div className="badge bg-blue-950 text-white">8</div></a></li>
                            <li><a href='/notifications'>Student Notifications<div className="badge bg-blue-950 text-white">3</div></a></li>
                            <li><a className='bg-red-700 text-white mt-4' onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
