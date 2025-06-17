"use client";
import React from "react";
import CustomIntro from "../CustomIntro";
import Image from "next/image";
import pic from "@/images/tui4.jpg";
const WhyChooseUs = () => {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-10 my-32 px-5">
      <CustomIntro
        cusTitle="Tại Sao Lại Lựa Chọn Chúng Tôi? "
        description="Thời trang bền vững: Chúng tôi cam kết sử dụng vật liệu tái tạo, giảm thiểu rác thải và tác động đến môi trường.

Cá nhân hóa: RECO mang đến dịch vụ tùy chỉnh giúp bạn thể hiện phong cách và cá tính riêng.

Gắn kết cộng đồng: RECO không chỉ là một thương hiệu thời trang, mà là một phần của cộng đồng yêu thương, nơi chúng tôi cùng nhau tạo ra sự thay đổi tích cực cho môi trường và xã hội."
      button2="Tư vấn ngay"
      onClick={() => window.open("https://www.facebook.com/profile.php?id=61576419491353", "_blank")}
      />
      <Image src={pic} alt="alt" width={500} height={200} />
    </div>
  );
};

export default WhyChooseUs;
