"use client"
import React from 'react'
import { formatTimeToAmPm, formatDateToDdMmYyyy } from "../../utils/formattime"

type Message = {
    sender_name : string;
    sender_id: string;
    receiver_id: string;
    message: string;
    timestamp: string;
};

const Inbox = ({message} : {message:Message}) => {
  return (
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
                <p className='text-lg font-bold'>{message.sender_name}</p>
    </div>
            <div className='flex w-full justify-start items-start'>
                <p className='text-xs font-medium text-gray-500'>{message.message}</p>
    </div>

        </div>
        <div className='flex flex-col col-span-1  justify-center items-start pr-4'>
            <div className="text-right">
                <p className="text-xs font-semibold">{formatTimeToAmPm(message.timestamp)}</p>
                <p className="text-xs font-semibold uppercase text-gray-600">{formatDateToDdMmYyyy(message.timestamp)}</p>
            </div>
        </div>
    </div>
    
  )
}

export default Inbox