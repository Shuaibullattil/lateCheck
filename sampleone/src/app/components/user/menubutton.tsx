"use client";
import React from 'react';

const MenuButton = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <ul className="menu menu-horizontal bg-base-200 rounded-box">
        <li>
          <a href='/home'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </a>
        </li>
        <li>
          <a href='/qrscanner'>
            <img src="/scan.svg" alt="" className='h-6 w-6' />
          </a>
        </li>
        <li>
          <a href='/notify'>
            <img src="/notification.svg" alt="" className='h-6 w-6' />
          </a>
        </li>
        <li>
          <a href='/profile'>
            <img src="/profile.svg" alt="" className='h-6 w-6' />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default MenuButton;
