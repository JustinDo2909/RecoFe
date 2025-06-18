"use client";
import React from "react";
import banner from "@/images/usBanner.jpg";
import Image from "next/image";
import { Button } from "../ui/button";

const AboutUsBanner = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 py-12">
      <div className="w-full lg:w-1/2">
        <Image
          src={banner}
          alt="Banner"
          width={800}
          height={600}
          className="object-cover w-full h-[400px] md:h-[500px] lg:h-[600px] "
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-5">
        <h1 className="uppercase text-5xl font-semibold">reco</h1>
        <p className="text-lg lg:text-2xl">
          RECO là thương hiệu tiên phong trong việc mang đến thời trang bền vững
          thông qua tái tạo sản phẩm và cá nhân hóa. Chúng tôi tin rằng thời
          trang không chỉ là sự thể hiện phong cách, mà còn là một công cụ để
          bảo vệ môi trường và xây dựng một cộng đồng hướng đến sự phát triển
          bền vững.
        </p>

        <div className="flex gap-3">
          <Button
            onClick={() =>
              window.open(
                "https://www.facebook.com/profile.php?id=61576419491353",
                "_blank",
              )
            }
            className="rounded-full px-6 py-3"
          >
            LIÊN HỆ
          </Button>
          <Button
            onClick={() =>
              window.open(
                "https://www.facebook.com/profile.php?id=61576419491353",
                "_blank",
              )
            }
            className="bg-transparent border border-black text-black rounded-full px-6 py-3"
          >
            TÌM HIỂU
          </Button>
        </div>

        <div className="border-b w-1/2"></div>

        <div>
          <p className="text-lg">Có bất kỳ câu hỏi gì?</p>
          <p className="text-lg font-semibold">Liên hệ ngay với chúng tôi!</p>
          <p className="text-3xl text-red-500 font-bold mt-2">+84 123457890</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsBanner;
