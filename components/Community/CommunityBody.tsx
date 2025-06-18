"use client";
import React from "react";
import banner from "@/images/Communiti.jpg";
import CustomIntro from "../CustomIntro";
import Image from "next/image";

const CommunityBody = () => {
  return (
    <div className="flex justify-center my-20">
      <div>
        <Image src={banner} alt="banner" width={500} height={300} />
      </div>
      <CustomIntro
        cusTitle="CÙNG RECO XÂY DỰNG CỘNG ĐỒNG VỮNG MẠNH"
        description="RECO hiểu rằng mỗi món đồ cũ không chỉ là vật dụng, mà có thể trở thành một món quà đầy ý nghĩa cho những người cần sự giúp đỡ. Chúng tôi mong muốn có thể giúp kết nối bạn quyên góp đồ cũ cho các tổ chức từ thiện, giúp những đứa trẻ thiếu thốn và những người lớn gặp khó khăn có cơ hội thay đổi cuộc sống."
        button="TÌM HIỂU THÊM"
        onClick={() =>
          window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSfHvXBONhp5ihlLPca3xdRLyaKGHu-4r6M-oVcmPtJSNCO3hw/viewform?fbclid=IwY2xjawK7WBxleHRuA2FlbQIxMABicmlkETFxNm1TeHhOUzNKbFFaZlo4AR4qlskgsh1bvgkEtNB2WGhja1Vngh7sUbvlumEqdD3JC9MnWZ2HP0dSSfiDxQ_aem_deP4YLcuB0j0HeNnkj7pcw",
            "_blank",
          )
        }
      />
    </div>
  );
};

export default CommunityBody;
