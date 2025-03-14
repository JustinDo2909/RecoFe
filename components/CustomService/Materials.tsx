import Image from "next/image";
import React from "react";
import material from "@/images/material.jpg";

const Materials = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 my-10">
      <div className="w-full">
        <Image
          src={material}
          alt="material"
          width={400}
          height={300}
          className="object-cover w-full rounded-lg shadow-lg"
        />
      </div>
      <div className="w-full  text-center md:text-left">
        <h2 className="text-2xl font-semibold mb-2">Chọn Lựa Chất Liệu</h2>
        <p className="text-gray-700">
          Khách hàng có thể chọn loại vải hoặc chất liệu phù hợp cho sản phẩm,
          như vải tái chế, vải organic hoặc các vật liệu thân thiện với môi
          trường.
        </p>
      </div>
    </div>
  );
};

export default Materials;
