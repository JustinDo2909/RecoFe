"use client";
import React, { useEffect, useState } from "react";
import ChatBox from "../../../components/Chatbot/Chatbot";
import ChatInput from "../../../components/Chatbot/ChatInput";
import { usePostMessageMutation } from "../../../state/apiChatBot";
import { io } from "socket.io-client";
interface Message {
  text: string;
  sender: "user" | "bot";
}
const socket = io("http://localhost:5000");
const ChatBotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [postMessage, { isLoading }] = usePostMessageMutation();

  useEffect(() => {
    socket.on("bot_response", (data) => {
      const botMessage: Message = { text: data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    });

    return () => {
      socket.off("bot_response");
    };
  }, []);
  const addMessage = async (message: string) => {
    const userMessage: Message = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await postMessage({ message }).unwrap();
      const botMessage: Message = { text: response.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: Message = { text: "Đã có lỗi xảy ra.", sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <div className="flex flex-col min-h-[50vh] bg-gray-100 p-4">
      <ChatBox messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={addMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatBotPage;
