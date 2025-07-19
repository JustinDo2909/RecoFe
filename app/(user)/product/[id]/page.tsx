"use client";

import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { useGetProductByIdQuery } from "@/state/api";
import { BoxIcon, FileQuestion, ListOrderedIcon, Share, Palette } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const idCustom = "684a85aa1d6c9de849557543";

const SingleProductPage = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { data: product } = useGetProductByIdQuery({ id });
  const [selectedImage, setSelectedImage] = useState(0);

  const images = product?.picture?.length 
    ? product.picture 
    : [
        "http://res.cloudinary.com/dfyihjjih/image/upload/v1752832449/kjisfafoyo2rgbjxj4t5.jpg",
        "http://res.cloudinary.com/dfyihjjih/image/upload/v1752832449/placeholder_image_2.jpg",
        "http://res.cloudinary.com/dfyihjjih/image/upload/v1752832449/placeholder_image_3.jpg"
      ];

  return (
    <Container className="py-10 flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/2 flex flex-col items-center">
        {images.length > 0 && (
          <Image
            src={images[selectedImage]}
            width={500}
            height={500}
            alt="Ảnh sản phẩm"
            priority
            className="rounded-md border border-gray-100 shadow-sm"
          />
        )}
        {images.length > 2 && (
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {images.map((img: string, index: number) => (
              <Image
                key={index}
                src={img}
                width={80}
                height={80}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                className={`rounded-md border cursor-pointer transition-all ${
                  selectedImage === index ? "border-blue-500 shadow-md" : "border-gray-200"
                } hover:border-blue-400`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {product?.name}
          </h2>
          <PriceView
            price={product?.price}
            discount={20}
            className="text-lg font-bold"
          />
        </div>

        {product?.stock && (
          <p className="bg-green-100 w-fit px-4 py-2 text-green-600 text-sm font-semibold rounded-lg">
            Còn hàng
          </p>
        )}
        <AddToCartButton product={product ?? {}} />

        {id === idCustom && (
          <button
            onClick={() => {
              alert("Bạn chỉ có thể thiết kế khi đã mua sản phẩm thành công!");
            }}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Palette className="h-5 w-5" /> Tùy chỉnh thiết kế
          </button>
        )}

        <p className="text-sm text-gray-700 leading-relaxed">
          {product?.description}
        </p>

        <ProductCharacteristics product={product || {}} />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 py-5 mt-5">
          <OptionItem
            onClick={() => router.push(`/product`)}
            icon={<BoxIcon />}
            text="Các sản phẩm khác"
          />
          <OptionItem
            onClick={() =>
              window.open(
                "https://www.facebook.com/profile.php?id=61576419491353",
                "_blank"
              )
            }
            icon={<FileQuestion />}
            text="Đặt câu hỏi"
          />
          <OptionItem
            onClick={() => router.push(`/chatbot`)}
            icon={<ListOrderedIcon />}
            text="AI-Style"
          />
          <OptionItem
            onClick={() =>
              window.open(
                "https://www.facebook.com/profile.php?id=61576419491353",
                "_blank"
              )
            }
            icon={<Share />}
            text="Chia sẻ"
          />
        </div>

        <div className="flex flex-wrap items-center gap-5 mt-4">
          <PolicyCard
            title="Vận chuyển nhanh chóng"
            description="Mọi sản phẩm đều được đóng gói nhanh chóng"
          />
          <PolicyCard
            title="Thân thiện với môi trường"
            description="Sản phẩm được làm từ quần áo tái chế"
          />
          <PolicyCard
            title="Thanh toán linh hoạt"
            description="Hỗ trợ nhiều loại thẻ tín dụng"
          />
        </div>
      </div>
    </Container>
  );
};

const OptionItem = ({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 cursor-pointer transition-all"
  >
    {icon}
    <p>{text}</p>
  </div>
);

const PolicyCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="border border-gray-300 text-center p-4 rounded-md hover:border-blue-500 transition-all">
    <p className="text-base font-semibold text-gray-800">{title}</p>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

export default SingleProductPage;