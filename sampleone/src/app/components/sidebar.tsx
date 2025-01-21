// components/sidebar.tsx
import React from 'react';

const SideBar = () => {
    return (
        <div className="drawer drawer-open ">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4  h-full w-80 bg-base-300 text-base-content">
                    <li><a className='bg-black text-white'>Dashboard</a></li>
                    <li><a>Student Detail</a></li>
                    <li><a>Attendance</a></li>
                    <li><a>Late Entries</a></li>
                    <li><a>Send Notification</a></li>
                    <li><a className='bg-error text-white'>Logout</a></li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
