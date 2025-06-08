"use client";
import cus1 from "@/images/cus1.png";
import cus2 from "@/images/cus2.png";
import cus3 from "@/images/cus3.png";
import cus4 from "@/images/cus4.png";
import CustomServiceIntro from "../HomePage/CustomServiceIntro";

const Customization = () => {
  const customList = [
    {
      image: cus1,
    },
    {
      image: cus2,
    },
    {
      image: cus3,
    },
    {
      image: cus4,
    },
  ];
  return (
    <div className="my-10">
      <CustomServiceIntro
        CustomProps={{
          customList: customList,
          button: "SỬ DỤNG DỊCH VỤ CUSTOM",
          description:
            "Bạn có thể yêu cầu thay đổi thiết kế sản phẩm (như túi xách, áo thun, quần jeans hoặc phụ kiện) để phù hợp với phong cách cá nhân của bạn. Ví dụ: thêm hình vẽ, chữ, hoặc logo riêng.",
          cusTitle: "Tùy Chỉnh Thiết Kế",
          onClick: () =>
            window.open(
              "https://www.facebook.com/profile.php?id=61576419491353",
              "_blank"
            ),
        }}
      />
    </div>
  );
};

export default Customization;
