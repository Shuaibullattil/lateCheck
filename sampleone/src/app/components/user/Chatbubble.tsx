import React from "react";
import { formatDateToDdMmYyyy } from "@/utils/formattime";

interface ChatbubbleProps {
  message: string;
  timestamp: string;
  isSender: boolean;
}

const Chatbubble: React.FC<ChatbubbleProps> = ({ message, timestamp, isSender, }) => {
  return (
    <div className={`chat ${isSender ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="User Avatar"
            src="https://i.pinimg.com/474x/18/18/be/1818be30919df15146268441cd6a1c3f.jpg"
          />
        </div>
      </div>
      <div className="chat-footer pl-2 text-xs font-light text-gray-400">{formatDateToDdMmYyyy(timestamp)}</div>
      <div className="chat-bubble">{message}</div>
    </div>
  );
};

export default Chatbubble;
