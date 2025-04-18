"use client"
import React from 'react'
import { formatTimeToAmPm, formatDateToDdMmYyyy } from "../../utils/formattime"

type Message = {
    sender_name: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    timestamp: string;
};

const Inbox = ({message} : {message:Message}) => {
  return (
    <div className='bg-white border-b border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer'>
      <div className='flex items-start'>
        {/* Avatar */}
        <div className='flex-shrink-0 mr-3'>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src="https://i.pinimg.com/474x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg" 
              alt={message.sender_name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        {/* Message content */}
        <div className='flex-grow'>
          <div className='flex justify-between items-baseline mb-1'>
            <p className='font-medium text-gray-800'>{message.sender_name}</p>
            <p className="text-xs text-gray-500">{formatTimeToAmPm(message.timestamp)}</p>
          </div>
          <div className='w-full text-left'>
            <p className='text-sm text-gray-600 line-clamp-2'>{message.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inbox