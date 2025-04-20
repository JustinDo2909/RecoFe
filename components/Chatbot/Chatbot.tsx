import React from "react";
import LogoReco from "../LogoReco";

interface ChatBoxProps {
  messages: { text: string; sender: "user" | "bot" }[];
  isLoading?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow mb-2">
    
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 p-2 rounded-lg w-fit max-w-[75%] flex ${
            msg.sender === "user" && "bg-blue-100 self-end ml-auto" 
          }`}
        >
          {msg.sender === "bot" && msg.text && (
            <div className="flex justify-center items-center mr-2">
              <LogoReco className="w-14 h-14 object-contain" />
              <div>{msg.text}</div>
            </div>
          )}
          {msg.sender === "user" && <div>{msg.text}</div>}
        </div>
      ))}
        {isLoading && (
        <div className="text-sm text-gray-500 italic mt-2">
          Bot đang trả lời...
        </div>
      )}
    </div>
  );
};

export default ChatBox;
