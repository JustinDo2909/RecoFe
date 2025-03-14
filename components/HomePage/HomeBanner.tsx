import React from "react";
import Image from "next/image";
import banner from "@/images/Banner.jpg";
import Logo from "../Logo";
import { Button } from "../ui/button";

const HomeBanner = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center bg-white w-full h-auto md:h-screen">
      <div className="flex flex-1 flex-col items-center justify-center text-center space-y-5 p-6 md:p-10">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold">
          Chào Mừng Bạn Đến Với
        </h1>
        <Logo className="text-xl md:text-3xl lg:text-4xl">
          RECO - THỜI TRANG BỀN VỮNG
        </Logo>
        <Button className="px-6 py-3 text-lg">XEM SẢN PHẨM</Button>
      </div>

      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <Image
          alt="banner"
          src={banner}
          width={600}
          height={500}
          className="object-cover w-full h-auto md:h-full"
        />
      </div>
    </div>
  );
};

export default HomeBanner;
