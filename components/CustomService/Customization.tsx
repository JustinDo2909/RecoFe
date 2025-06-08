"use client"
import React from 'react'
import CustomServiceIntro from '../HomePage/CustomServiceIntro'
import feedback from "@/images/feedback.png";

const Customization = () => {
    const customList = [
      {
        image: feedback,
      },
      {
        image: feedback,
      },
      {
        image: feedback,
      },
      {
        image: feedback,
      },
    ];
  return (
    <div className='my-10'>
      <CustomServiceIntro CustomProps={{
        customList: customList,
        button: 'SỬ DỤNG DỊCH VỤ CUSTOM',
        description: 'Bạn có thể yêu cầu thay đổi thiết kế sản phẩm (như túi xách, áo thun, quần jeans hoặc phụ kiện) để phù hợp với phong cách cá nhân của bạn. Ví dụ: thêm hình vẽ, chữ, hoặc logo riêng.',
        cusTitle: 'Tùy Chỉnh Thiết Kế',
        onClick: () => window.open("https://www.facebook.com/profile.php?id=61576419491353", "_blank")
      }} />
    </div>
  )
}

export default Customization