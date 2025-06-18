"use client";
import React from "react";
import customBanner from "@/images/CustomBanner.jpg";
import Image from "next/image";
import CustomIntro from "../CustomIntro";

const CustomBanner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 my-10">
      {/* Hình ảnh */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          alt="customBanner"
          src={customBanner}
          width={400}
          height={400}
          className="object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Nội dung */}
      <div className="w-full md:w-1/2 text-center md:text-left max-w-lg">
        <CustomIntro
          button="TƯ VẤN NGAY"
          cusTitle="Dịch Vụ Custom"
          description="Tại RECO, chúng tôi hiểu rằng mỗi khách hàng đều có phong cách và sở thích riêng. Chính vì vậy, chúng tôi cung cấp dịch vụ custom (tùy chỉnh) để giúp bạn tạo ra những sản phẩm độc đáo và cá nhân hóa, hoàn toàn phù hợp với nhu cầu của mình."
          onClick={() =>
            window.open(
              "https://www.facebook.com/profile.php?id=61576419491353",
              "_blank",
            )
          }
        />
      </div>
    </div>
  );
};

export default CustomBanner;
