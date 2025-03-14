import React from "react";
import pic1 from "@/images/abouus2.jpg";
import pic2 from "@/images/aboutus3.jpg";
import pic3 from "@/images/aboutus4.jpg";
import Image from "next/image";
import CustomIntro from "../CustomIntro";

const Mission = () => {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-10 my-32 px-5">
      {/* Ảnh đầu tiên (nhỏ) */}
      <div className="rounded-tr-lg overflow-hidden w-full md:w-auto flex justify-center">
        <Image
          src={pic1}
          alt="pic1"
          width={300}
          height={200}
          className="object-cover h-[400px] w-[250px] md:w-[400px] rounded-tr-[30%]"
        />
      </div>

      {/* Nội dung và ảnh thứ hai (nhỏ) */}
      <div className="flex flex-col justify-center items-center gap-10 w-full">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-5">
          <CustomIntro
            cusTitle="Sứ Mệnh Của Chúng Tôi"
            description="Sứ mệnh của RECO là tạo ra một thế giới thời trang xanh, nơi mỗi sản phẩm không chỉ giúp bạn nổi bật mà còn góp phần bảo vệ hành tinh. Chúng tôi tin rằng mỗi món đồ thời trang cũ đều có thể tái tạo và mang lại giá trị mới, đồng thời tạo ra cơ hội cho những người cần sự giúp đỡ qua việc kết nối với các tổ chức từ thiện."
          />
          <div className=" overflow-hidden w-full md:w-auto flex justify-center">
            <Image
              src={pic2}
              alt="pic2"
              width={300}
              height={200}
              className="object-contain h-[190px] w-[250px] md:w-[300px] rounded-bl-[60%]"
            />
          </div>
        </div>

        {/* Ảnh cuối cùng (to hơn) */}
        <div className="rounded-tr-lg overflow-hidden w-full md:w-auto flex justify-center">
          <Image
            src={pic3}
            alt="pic3"
            width={500}
            height={400}
            className="object-contain h-[300px] w-[400px] md:w-[350px] rounded-tr-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Mission;
