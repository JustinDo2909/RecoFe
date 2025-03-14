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
export default function Home() {
  const {
    data: product
  } = useGetProductQuery({});
  console.log(product);
  const feedbackList = [
    {
      image: feedback,
      rate: 5,
      title: "Dịch vụ tuyệt vời!",
      name: "Nguyễn Văn A",
    },
    {
      image: feedback,
      rate: 4,
      title: "Rất hài lòng",
      name: "Trần Thị B",
    },
    {
      image: feedback,
      rate: 4.5,
      title: "Chất lượng tốt!",
      name: "Lê Văn C",
    },
    {
      image: feedback,
      rate: 5,
      title: "Sẽ quay lại lần sau!",
      name: "Phạm Thị D",
    },
  ];
  const customList = [
    {
      image: feedback,
      title: "Dịch vụ tuyệt vời!",
    },
    {
      image: feedback,
      title: "Rất hài lòng",
    },
    {
      image: feedback,
      title: "Chất lượng tốt!",
    },
    {
      image: feedback,
      title: "Sẽ quay lại lần sau!",
    },
  ];
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
