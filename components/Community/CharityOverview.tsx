"use client";
import { useInView } from "framer-motion";
import React, { useRef } from "react";
import { countUpItems } from "@/constants/index";
import MyCountUp from "../CountTip";
import pic from "@/images/CustomBanner.jpg";
import Image from "next/image";

const CharityOverview = () => {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 px-6 lg:px-16 py-12">
      {/* Phần thông tin bên trái */}
      <div className="flex flex-col lg:w-1/2 gap-10">
        <h1 className="font-semibold text-4xl text-center">Chúng Tôi Luôn Có Mặt Nơi Mà Thời Trang Cần Sự Giúp Đỡ</h1>
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-2 gap-8 mt-8">
        {countUpItems.map((item) => (
            <div key={item.id} className="text-center">
              {inView && (
                <MyCountUp
                  start={0}
                  end={item.number}
                  duration={3}
                  title={item.title}       
                  description={item.text}   
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-1/2 flex justify-center">
        <Image
          src={pic}
          alt="Chúng tôi luôn có mặt"
          width={600} 
          height={600} 
          className="object-cover w-full max-w-2xl mx-auto "
        />
      </div>
    </div>
  );
};

export default CharityOverview;
