"use client";
import Container from "@/components/Container";
import CustomServiceIntro from "@/components/HomePage/CustomServiceIntro";
import FeedBack from "@/components/HomePage/FeedBack";
import HomeBanner from "@/components/HomePage/HomeBanner";
// import HomeTitle from "@/components/HomePage/HomeTitle";
// import NewsAndBlog from "@/components/HomePage/NewsAndBlog";
import ShareLove from "@/components/HomePage/ShareLove";
import ProductGrid from "@/components/ProductGrid";
import ProductSlide from "@/components/ProductSlide";
import Title from "@/components/Title";
import { useGetProductQuery } from "@/state/api";
import feedback from "@/images/feedback.png";
import feedback2 from "@/images/feedback2.png";
import feedback3 from "@/images/feedback3.png";
import feedback4 from "@/images/feedback4.png";
import cus1 from "@/images/cus1.png";
import cus2 from "@/images/cus2.png";
import cus3 from "@/images/cus3.png";
import cus4 from "@/images/cus4.png";
import { useEffect, useState } from "react";
export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { data: product } = useGetProductQuery({});
  const feedbackList = [
    {
      image: feedback,
      rate: 5,
      title: "Dịch vụ tuyệt vời!",
      name: "Nguyễn Văn A",
    },
    {
      image: feedback2,
      rate: 4,
      title: "Rất hài lòng",
      name: "Trần Thị B",
    },
    {
      image: feedback3,
      rate: 4.5,
      title: "Chất lượng tốt!",
      name: "Lê Văn C",
    },
    {
      image: feedback4,
      rate: 5,
      title: "Sẽ quay lại lần sau!",
      name: "Phạm Thị D",
    },
  ];
  const customList = [
    {
      image: cus1,
      title: "Áo Thun Patchwork",
    },
    {
      image: cus2,
      title: "Quần Jeans Cá Tính",
    },
    {
      image: cus3,
      title: "Túi Tote Vải ",
    },
    {
      image: cus4,
      title: "Quần Jeans Thêu",
    },
  ];

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <HomeBanner />
      <Container className="py-10">
        <Title>Sản Phẩm Tái Tạo Tạo Nên Phong Cách Riêng</Title>
        <ProductSlide products={product ? product : []} />
        <FeedBack feedbackList={feedbackList} />
        <CustomServiceIntro
          CustomProps={{
            cusTitle: "Dịch Vụ Custom",
            description:
              "RECO cung cấp dịch vụ custom giúp bạn tạo ra những món đồ thời trang độc đáo và bền vững. Bạn có thể tùy chỉnh thiết kế, màu sắc, kích cỡ và chất liệu theo sở thích, đồng thời thêm hình ảnh, chữ thêu hoặc các chi tiết cá nhân hóa.",
            button: "KHÁM PHÁ NGAY",
            customList: customList,
          }}
        />
        <Title>Các Sản Phẩm Dành Cho Mùa Hè</Title>
        <ProductGrid products={product ? product : []} />
        <ShareLove />
        {/* <Title>Tin Tức & Blog</Title>
        <NewsAndBlog /> */}
      </Container>
    </div>
  );
}
