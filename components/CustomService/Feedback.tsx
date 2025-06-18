"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

const Feedback = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Tránh lỗi khi render trên server

  return (
    <div className="py-12 my-10 bg-[#A0BBA7]">
      <div className="text-center mb-8 px-4">
        <h2 className="text-lg md:text-xl text-gray-800 uppercase tracking-wide">
          Dịch Vụ Custom
        </h2>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Phản Hồi Của Khách Hàng
        </h1>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white p-6 md:p-8 w-[90%] md:w-2/3 mx-auto rounded-lg shadow-lg relative overflow-hidden rounded-tl-[120px] rounded-br-[120px]"
      >
        <p className="text-gray-700 leading-relaxed italic text-sm md:text-base text-center">
          &ldquo;Mình rất hài lòng với dịch vụ custom của RECO!...&rdquo;
        </p>

        <div className="flex justify-center mt-4 text-yellow-500 text-xl md:text-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <MotionDiv
              key={i}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            >
              ★
            </MotionDiv>
          ))}
        </div>

        <p className="text-sm md:text-lg font-semibold text-gray-900 mt-3 text-center">
          Minh Đức
        </p>
      </MotionDiv>
    </div>
  );
};

export default Feedback;
