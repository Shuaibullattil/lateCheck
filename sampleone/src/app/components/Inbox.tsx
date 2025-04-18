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
    <div className='bg-white shadow-sm border border-green-200 rounded-xl my-2 hover:bg-[#f1fdf3] transition-all duration-200 hover:shadow-md hover:scale-[1.01]'>
        <div className='flex items-center p-3'>
            {/* Avatar */}
            <div className='flex-shrink-0 mr-3'>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-400">
                    <img src="https://i.pinimg.com/474x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg" alt={message.sender_name} className="w-full h-full object-cover" />
                </div>
            </div>
            
            {/* Message content */}
            <div className='flex-grow'>
                <div className='flex justify-between items-center mb-1'>
                    <p className='text-lg font-bold text-green-800'>{message.sender_name}</p>
                    <div className="text-right">
                        <p className="text-xs font-semibold text-green-700">{formatTimeToAmPm(message.timestamp)}</p>
                        <p className="text-xs font-medium text-gray-500">{formatDateToDdMmYyyy(message.timestamp)}</p>
                    </div>
                </div>
                <div className='w-full'>
                    <p className='text-sm text-gray-600 line-clamp-2'>{message.message}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Inbox