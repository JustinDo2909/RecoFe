"use client";
import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onImageSelect?: (file: File) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onImageSelect,
  isLoading,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onImageSelect) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded"
        placeholder="Nhập tin nhắn..."
        disabled={isLoading}
      />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        Gửi
      </button>
    </div>
  );
};

export default ChatInput;
