import React, { useState } from "react";

interface Props {
  onSendMessage: (msg: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<Props> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="mt-auto flex gap-2 p-2 bg-white rounded-lg shadow">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Nhập tin nhắn..."
        className="flex-1 px-4 py-2 border rounded-lg outline-none"
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Gửi
      </button>
    </div>
  );
};

export default ChatInput;
