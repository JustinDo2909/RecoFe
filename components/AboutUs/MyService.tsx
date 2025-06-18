import React from "react";
import pic1 from "@/images/tui1.png";
import pic2 from "@/images/tui2.png";
import pic3 from "@/images/tui3.jpg";
import Image from "next/image";
import Link from "next/link";

const MyService = () => {
  const items = [
    {
      id: 1,
      name: "Sản Phẩm Tái Tạo",
      description:
        "Mỗi sản phẩm của RECO được làm từ những món đồ cũ đã được tái tạo lại thành những chiếc túi xách độc đáo, mang lại sự độc đáo và thân thiện với môi trường.",
      image: pic1,
      link: "product",
    },
    {
      id: 2,
      name: "Dịch Vụ Custom",
      description:
        "RECO cung cấp dịch vụ tùy chỉnh sản phẩm, từ thay đổi thiết kế đến khắc tên hoặc hình ảnh, giúp bạn sở hữu sản phẩm độc nhất vô nhị.",
      image: pic2,
      link: "custom",
    },
    {
      id: 3,
      name: "Kết Nối Quyên Góp",
      description:
        "RECO giúp kết nối khách hàng với các tổ chức từ thiện, tạo cơ hội để quyên góp đồ cũ và giúp đỡ cộng đồng, đặc biệt là những người gặp khó khăn và thiếu thốn.",
      image: pic3,
      link: "community",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-gray-600 text-xl">RECO</h2>
      <h2 className="text-4xl font-semibold mb-2 text-#505050">
        Dịch Vụ Của Chúng Tôi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`group text-sm rounded-lg overflow-hidden flex flex-col border border-zinc-200 bg-zinc-50 ${
              index === 1 ? "mt-20" : ""
            }`}
          >
            <div className="relative overflow-hidden">
              <Link href={`${item.link}`}>
                <Image
                  src={item.image}
                  width={500}
                  height={500}
                  alt={item.name}
                  priority
                  className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyService;
