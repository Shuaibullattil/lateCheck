import React from "react";
import { formatDateToDdMmYyyy } from "@/utils/formattime";

interface ChatbubbleProps {
  message: string;
  timestamp: string;
  isSender: boolean;
}

const Chatbubble: React.FC<ChatbubbleProps> = ({ message, timestamp, isSender }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} space-x-2`}>
      {/* User Avatar (only for receiver) */}

      {/* Message Bubble */}
      <div className="flex flex-col items-start">
        <div
          className={`max-w-4/5 p-3 rounded-lg text-sm border border-green-400 border-1 ${
            isSender ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
          style={{ wordWrap: "break-word" }}
        >
          {message}
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs font-light text-gray-400 pt-1 ${
            isSender ? "text-right" : "text-left"
          }`}
        >
          {formatDateToDdMmYyyy(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Chatbubble;
