import Image from "next/image";
import React from "react";
import renewal from "@/images/renewak.png";
const Renewal = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 py-10">
      <div className="w-full  text-center md:text-left">
        <h2 className="text-2xl font-semibold mb-2">
          Sửa Đổi & Tái Tạo Sản Phẩm Cũ
        </h2>
        <p className="text-gray-700">
          Khách hàng có thể gửi sản phẩm cũ để RECO tái táo hoặc sửa đổi thành
          một sản phẩm mới, mang lại sự độc đáo và giá trị cảm xúc. Bước 1: Gửi
          yêu cầu và sản phẩm: Khách hàng gửi yêu cầu tái chế hoặc sửa đổi sản
          phẩm qua website hoặc kênh hỗ trợ của RECO. Bước 2: Tư vấn và lựa
          chọn: RECO tư vấn về các lựa chọn sửa đổi, tái chế và xác định tính
          khả thi của yêu cầu. Bước 3: Gửi sản phẩm: Khách hàng gửi sản phẩm cũ
          đến RECO qua bưu điện hoặc trực tiếp. Bước 4: Tái chế và sửa đổi: RECO
          tiến hành tái chế hoặc sửa đổi sản phẩm theo yêu cầu, bao gồm thay đổi
          thiết kế, màu sắc, hoặc vật liệu. Bước 5: Gửi lại sản phẩm: RECO gửi
          lại sản phẩm hoàn thiện cho khách hàng. Bước 6: Đánh giá và phản hồi:
          Khách hàng đánh giá dịch vụ và sản phẩm qua các kênh phản hồi của
          RECO.
        </p>
      </div>
      <div className="w-full">
        <Image
          src={renewal}
          alt="material"
          width={400}
          height={300}
          className="object-cover w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Renewal;
