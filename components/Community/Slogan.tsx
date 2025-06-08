"use client"
import React from "react";
import { Button } from "../ui/button";

const Slogan = () => {
  return (
    <div className="my-10 flex flex-col bg-[#A0BBA7] justify-center items-center p-10">
      <div>
        <p className="text-3xl font-semibold text-center">
          &ldquo;Hãy Cùng Các Tổ Chức Từ Thiện Quyên Góp Đồ Cũ, Mang Đến Cuộc
          Sống Tốt Đẹp Hơn Cho Những Người Cần!&rdquo;
        </p>
      </div>
      <div className="flex gap-5 my-10 p-4">
        <Button onClick={() => window.open("https://www.facebook.com/profile.php?id=61576419491353", "_blank")} className="p-4">QUYÊN GÓP NGAY</Button>
        <Button onClick={() => window.open("https://www.facebook.com/profile.php?id=61576419491353", "_blank")} className="bg-transparent border border-black text-black">
          TÌM HIỂU THÊM
        </Button>
      </div>
    </div>
  );
};

export default Slogan;
