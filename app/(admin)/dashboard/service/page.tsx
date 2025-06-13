"use client";
import CustomeTable from "@/components/CustomeTable";
import Loading from "@/components/Loading";
import { useGetAllCustomQuery } from "@/state/api";
import { Custome, CustomResponse } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

const DashboardService = () => {
  const { data: customs, isLoading } = useGetAllCustomQuery({});
  const [customList, setCustomList] = useState<CustomResponse[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (customs) {
      setCustomList(customs.data as CustomResponse[]);
      console.log("customs", customs);
    }
  }, [customs]);

  return (
    <div>
      {isLoading && <Loading />}

      <CustomeTable
        ITEMS_PER_PAGE={10}
        data={customList}
        columns={[
          { key: "_id", label: "ID" },
          {
            key: "user.username",
            label: "Username",
            render: (row: Custome) => row.user?.username || "N/A",
          },
          {
            key: "user.email",
            label: "Email",
            render: (row: Custome) => row.user?.email || "N/A",
          },
          {
            key: "user.phone",
            label: "Phone",
            render: (row: Custome) => row.user?.phone || "N/A",
          },
          {
            key: "product.name",
            label: "Product",
            render: (row: Custome) => row.product?.name || "N/A",
          },
          {
            key: "createdAt",
            label: "Created At",
            render: (row: Custome) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
          },
          {
            key: "image",
            label: "Image",
            render: (row: Custome) => (
              <Image
                src={row.image}
                alt="custom"
                width={50}
                height={50}
                className="rounded border object-contain cursor-pointer"
                onClick={() => setSelectedImage(row.image)}
              />
            ),
          },
        ]}
      />

      {/* ✅ Ảnh to khi click */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Zoomed" className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default DashboardService;
