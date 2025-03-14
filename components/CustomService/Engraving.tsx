import Image from "next/image";
import React from "react";
import engraving1 from "@/images/engraving1.png";
import engraving2 from "@/images/engraving2.png";

const Engraving = () => {
  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
        Khắc Chữ Hoặc Hình Ảnh
      </h2>
      <p className="text-gray-600 text-center mb-5">
        Dịch vụ khắc tên, thông điệp hoặc hình ảnh đặc biệt lên sản phẩm.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[engraving1, engraving2].map((image, index) => (
          <div key={index} className="overflow-hidden rounded-md shadow-md">
            <Image
              src={image}
              alt={`Engraving ${index + 1}`}
              width={300}
              height={200}
              className="w-full max-h-[400px] object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Engraving;
