import React from 'react'

const Chatbubble = ({message,timestamp} : {message:String,timestamp:string}) => {
  return (
    <div>
        <div className="chat chat-end">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://i.pinimg.com/474x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg" />
                </div>
            </div>
            <div className="chat-footer pl-2 text-xs font-light text-gray-400">
                {timestamp}
            </div>
            <div className="chat-bubble">{message}</div>
           
        </div>
    </div>
  )
}

export default Chatbubble