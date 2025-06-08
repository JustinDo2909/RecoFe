"use client"
import React from "react";
import Image, { StaticImageData } from "next/image";
import CustomIntro from "../CustomIntro";

interface Custom {
  image: string | StaticImageData
  title?: string;
}

interface CustomProps {
  cusTitle: string;
  description: string;
  button: string;
  customList: Custom[];
  onClick?: () => void
}

const CustomServiceIntro = ({ CustomProps }: { CustomProps: CustomProps }) => {
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row gap-6">
       
        <CustomIntro onClick={CustomProps.onClick} button={CustomProps.button} cusTitle={CustomProps.cusTitle} description={CustomProps.description}/>
        <div className="relative w-full md:w-1/2 overflow-hidden">
          <div className="flex space-x-4 overflow-x-auto  p-2">
            {CustomProps.customList.map((item, index) => (
              <div key={index} className="min-w-[200px] flex-shrink-0">
                <Image
                  alt="pic"
                  src={item.image}
                  width={200}
                  height={200}
                  className="object-cover rounded-lg shadow-lg"
                />
                <p className="text-center mt-2 text-sm">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomServiceIntro;
