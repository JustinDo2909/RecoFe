"use client";
import CustomeTable from "@/components/CustomeTable";
import Loading from "@/components/Loading";
import { useGetAllCustomQuery } from "@/state/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";

const DashboardService = () => {
  const { data: customs, isLoading } = useGetAllCustomQuery();
  const [customList, setCustomList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (customs) {
      const reversedData = [...(customs.data || [])].reverse();
      setCustomList(reversedData);
      setFilteredList(reversedData); // mặc định hiển thị tất cả
    }
  }, [customs]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = customList.filter((item) => {
      const username = item.user?.username?.toLowerCase() || "";
      const email = item.user?.email?.toLowerCase() || "";
      const phone = item.user?.phone?.toLowerCase() || "";
      const product = item.product?.name?.toLowerCase() || "";
      return (
        username.includes(lowerSearch) ||
        email.includes(lowerSearch) ||
        phone.includes(lowerSearch) ||
        product.includes(lowerSearch)
      );
    });

    setFilteredList(filtered);
  }, [searchTerm, customList]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 w-full">
      {isLoading && <Loading />}

      <div className="bg-white p-6 rounded-2xl shadow-xl flex-1 flex flex-col w-full max-w-none">
        {/* Header + Tìm kiếm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full">
          <h2 className="text-2xl font-bold text-pink-600">Danh sách đơn thiết kế</h2>

          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-[400px]">
            <Search className="text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, email, sản phẩm..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-3">
          Tổng số: <strong>{filteredList.length}</strong> đơn
        </div>

        {/* Bảng */}
        <div className="flex-1 overflow-x-auto w-full">
          <CustomeTable
            ITEMS_PER_PAGE={10}
            data={filteredList}
            columns={[
              // { key: "_id", label: "Mã đơn" },
              {
                key: "user.username",
                label: "Tên người dùng",
                render: (row: any) => row.user?.username || "Chưa có",
              },
              {
                key: "user.email",
                label: "Email",
                render: (row: any) => row.user?.email || "Chưa có",
              },
              {
                key: "user.phone",
                label: "Số điện thoại",
                render: (row: any) => row.user?.phone || "Chưa có",
              },
              {
                key: "product.name",
                label: "Sản phẩm",
                render: (row: any) => row.product?.name || "Chưa có",
              },
              {
                key: "createdAt",
                label: "Ngày tạo",
                render: (row: any) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
              },
              {
                key: "image",
                label: "Hình ảnh",
                render: (row: any) => (
                  <Image
                    src={row.image}
                    alt="Ảnh thiết kế"
                    width={50}
                    height={50}
                    className="rounded border object-cover cursor-pointer hover:scale-105 transition"
                    onClick={() => setSelectedImage(row.image)}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Ảnh phóng to */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="relative">
            <button
              className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} />
            </button>
            <img
              src={selectedImage}
              alt="Phóng to ảnh"
              className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardService;
