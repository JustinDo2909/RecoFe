"use client";
import React from "react";
import CustomIntro from "../CustomIntro";
import pic from "@/images/aboutus1.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
const AboutUsIntro = () => {
  const router = useRouter();
  return (
    <div className="py-16 px-6 lg:px-16 bg-[#637367] min-h-[300px] flex items-center">
      <div className="bg-[#A0BBA7] rounded-lg shadow-lg p-8 lg:p-12 flex flex-col lg:flex-row gap-8 items-center">
        {/* Phần nội dung */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <CustomIntro
            cusTitle="Chúng Tôi Là Ai?"
            description="Tại RECO, chúng tôi tự hào là thương hiệu đi đầu trong việc cung cấp các sản phẩm thời trang tái tạo từ những món đồ cũ, mang lại cuộc sống mới cho chúng..."
            button="Xem Các Sản Phẩm"
            onClick={() => router.push("/product") }
          />
        </div>

        {/* Phần hình ảnh */}
        <div className="lg:w-1/2">
          <Image
            src={pic}
            alt="Chúng tôi là ai?"
            width={600}
            height={400}
            className="object-cover w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsIntro;
