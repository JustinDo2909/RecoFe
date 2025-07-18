"use client";
import React from "react";
import Title from "../Title";
import Image, { StaticImageData } from "next/image";
import { Button } from "../ui/button";

interface Charity {
  image: string | StaticImageData;
  title: string;
  description: string;
  button: string;
}

const CharityCommunity = ({ charityList }: { charityList: Charity[] }) => {
  return (
    <div className="my-20 px-6">
      {/* Tiêu đề */}
      <div className="text-center mb-10">
        <Title>Các Tổ Chức Từ Thiện Quyên Góp Đồ Cũ</Title>
      </div>

      {/* Danh sách tổ chức */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charityList.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            {/* Hình ảnh */}
            <div className="w-full h-[250px] overflow-hidden rounded-md">
              <Image
                src={item.image}
                alt="Charity banner"
                width={500}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thông tin */}
            <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{item.description}</p>

            {/* Button */}
            <div className="mt-4">
              <Button
                onClick={() =>
                  window.open(
                    "https://docs.google.com/forms/d/e/1FAIpQLSfHvXBONhp5ihlLPca3xdRLyaKGHu-4r6M-oVcmPtJSNCO3hw/viewform?fbclid=IwY2xjawK7WBxleHRuA2FlbQIxMABicmlkETFxNm1TeHhOUzNKbFFaZlo4AR4qlskgsh1bvgkEtNB2WGhja1Vngh7sUbvlumEqdD3JC9MnWZ2HP0dSSfiDxQ_aem_deP4YLcuB0j0HeNnkj7pcw",
                    "_blank",
                  )
                }
                className=" text-white px-4 py-2 rounded-md"
              >
                {item.button}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharityCommunity;
