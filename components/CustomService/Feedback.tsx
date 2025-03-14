import React from "react";
import { motion } from "framer-motion";
const Feedback = () => {
  return (
    <div className="py-12 bg-[#A0BBA7]">
        {/* Tiêu đề */}
        <div className="text-center mb-8 px-4">
          <h2 className="text-lg md:text-xl text-gray-800 uppercase tracking-wide">
            Dịch Vụ Custom
          </h2>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Phản Hồi Của Khách Hàng
          </h1>
        </div>

        {/* Nội dung feedback */}
        <div className="bg-white p-6 md:p-8 w-[90%] md:w-2/3 mx-auto rounded-lg shadow-lg relative overflow-hidden rounded-tl-[120px] rounded-br-[120px]">
          <p className="text-gray-700 leading-relaxed italic text-sm md:text-base text-center">
            "Mình rất hài lòng với dịch vụ custom của RECO! Mình đã gửi chiếc áo
            cũ đến và yêu cầu thêm một số chi tiết cá nhân hóa. Khi nhận lại,
            mình thực sự bất ngờ với chất lượng. Sản phẩm không chỉ đẹp mà còn
            hoàn toàn phù hợp với phong cách của mình. RECO đã làm cho chiếc áo
            trở nên mới mẻ và độc đáo, lại còn rất thoải mái khi mặc. Thật tuyệt
            vời khi được cùng RECO đóng góp vào việc bảo vệ môi trường! Mình
            chắc chắn sẽ tiếp tục sử dụng dịch vụ này và giới thiệu cho bạn bè."
          </p>

          {/* Đánh giá sao */}
          <div className="flex justify-center mt-4 text-yellow-500 text-xl md:text-2xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>

          {/* Tên khách hàng */}
          <p className="text-sm md:text-lg font-semibold text-gray-900 mt-3 text-center">
            Minh Đức
          </p>
      </div>
    </div>
  );
};

export default Feedback;
