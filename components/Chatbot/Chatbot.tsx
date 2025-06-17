import React from "react";
import LogoReco from "../LogoReco";
import Image from "next/image";

interface ChatBoxProps {
  messages: {
    text: string;
    sender: "user" | "bot";
    image?: string | string[];
    description?: string;
    similarImagePaths?: string[];
    similarProducts?: { Giá: number }[];
  }[];
  isLoading?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  console.log("messages", messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow mb-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 p-3 rounded-lg w-fit max-w-[75%] flex flex-col ${
            msg.sender === "user"
              ? "bg-blue-100 self-end ml-auto"
              : "bg-gray-100"
          }`}
        >
          <div
            className={`flex ${msg.sender === "bot" ? "items-start" : "justify-end"}`}
          >
            {msg.sender === "bot" && (
              <LogoReco className="w-10 h-10 object-contain mr-2" />
            )}
            <div>{msg.text}</div>
          </div>

          {msg.description && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Thông tin chi tiết:</strong>
              <p>{msg.description}</p>
            </div>
          )}

          {msg.similarImagePaths && msg.similarImagePaths.length > 0 && (
            <div className="mt-2 grid grid-cols-1 gap-2">
              {msg.similarImagePaths.map((img, i) => (
                <div
                  key={i}
                  className="relative max-w-xs max-h-60 w-full h-60 border rounded-md"
                >
                  <Image
                    src={img}
                    alt={`Hình ảnh tương tự ${i}`}
                    fill
                    className="object-contain rounded-md"
                    unoptimized 
                  />
                </div>
              ))}
            </div>
          )}

          {msg.similarProducts && msg.similarProducts.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Sản phẩm tương tự:</strong>
              <ul>
                {msg.similarProducts.map((product, i) => (
                  <li key={i} className="flex justify-between">
                    <span>Sản phẩm {i + 1}</span>
                    <span>{product.Giá} VND</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {msg.image && (
            <div className="mt-2 grid grid-cols-1 gap-2">
              {(Array.isArray(msg.image) ? msg.image : [msg.image]).map(
                (img, i) => (
                  <Image
                    key={i}
                    src={img}
                    width={200}
                    height={200}
                    alt={`Image ${i}`}
                    className="max-w-xs max-h-60 rounded-md border object-contain"
                  />
                )
              )}
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="text-sm text-gray-500 italic mt-2 flex justify-start">
          <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full" />
          <span className="ml-2">Bot đang trả lời...</span>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
