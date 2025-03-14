import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import feedback from "@/images/feedback.png";

const ShareLove = () => {
  return (
    <div className="bg-[#A0BBA7] p-6 rounded-md mt-10">
      <div className="py-6">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          {/* Phần Nội Dung */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">
            &ldquo;Chia Sẻ Yêu Thương Cùng RECO&rdquo;
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Chia Sẻ Yêu Thương Cùng RECO không chỉ là một chiến dịch mà là một
              phong trào, nơi RECO kết nối với các tổ chức từ thiện và cá nhân
              để mang lại sự giúp đỡ cho những người gặp khó khăn, đặc biệt là
              trẻ em và cộng đồng thiếu thốn. Với mỗi món đồ bạn mua hoặc quyên
              góp, RECO sẽ giúp bạn lan tỏa yêu thương đến những người cần sự
              giúp đỡ, tạo ra một chuỗi giá trị bền vững cho cả người nhận và
              người cho.
            </p>
            <Button className="mt-4 px-6 py-3 text-sm">XEM THÊM</Button>
          </div>

          {/* Hình Ảnh */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              alt="custom"
              src={feedback}
              width={350}
              height={350}
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareLove;
