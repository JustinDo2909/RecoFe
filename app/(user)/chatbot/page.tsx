"use client";
import React, { useEffect, useState } from "react";
import ChatBox from "../../../components/Chatbot/Chatbot";
import ChatInput from "../../../components/Chatbot/ChatInput";
import { usePostMessageMutation } from "../../../state/apiChatBot";
import { io } from "socket.io-client";

interface Message {
  text: string;
  sender: "user" | "bot";
  image?: string; // URL hình ảnh (của user hoặc bot)
}

const socket = io("http://localhost:5000");

const ChatBotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postMessage, { isLoading }] = usePostMessageMutation();
  
  useEffect(() => {
    // Lắng nghe phản hồi bot từ WebSocket
    socket.on("prediction_result", (data) => {
      const botMessage: Message = {
        text: data.description || "Bot không trả lời được.",
        sender: "bot",
        image: data.similar_image_paths?.[0] || undefined, // dùng ảnh đầu tiên nếu có
      };
      setMessages((prev) => [...prev, botMessage]);
    });

    socket.on("processing_status", (status) => {
      const processingMsg: Message = {
        text: status.message,
        sender: "bot",
      };
      setMessages((prev) => [...prev, processingMsg]);
    });

    socket.on("prediction_error", (data) => {
      const errorMsg: Message = {
        text: data.error || "Lỗi không xác định.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    });

    return () => {
      socket.off("prediction_result");
      socket.off("processing_status");
      socket.off("prediction_error");
    };
  }, []);

  const addMessage = async (message: string) => {
    const userMsg: Message = {
      text: message,
      sender: "user",
      image: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
  
    const formData = new FormData();
    formData.append("question", message);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
  
    try {
      const data = await postMessage(formData as any).unwrap();
  
      // Giả sử API trả về answer + image
      const botMsg: Message = {
        text: data.answer || "Bot không trả lời được.",
        sender: "bot",
        image: data.similar_image_paths?.[0] || undefined,
      };
  
      setMessages((prev) => [...prev, botMsg]);
    } catch  {
      setMessages((prev) => [
        ...prev,
        {
          text: "Đã có lỗi xảy ra.",
          sender: "bot",
        },
      ]);
    }
  
    setSelectedImage(null);
  };
  

  return (
    <div className="flex flex-col min-h-[50vh] bg-gray-100 p-4">
      <ChatBox messages={messages} isLoading={isLoading} />
      <ChatInput
        onSendMessage={addMessage}
        onImageSelect={(file: File) => setSelectedImage(file)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatBotPage;
