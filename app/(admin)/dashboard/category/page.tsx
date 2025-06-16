"use client";

import CategoryForm from "@/app/(admin)/dashboard/category/cateForm";
import Loading from "@/components/Loading";
import UitlTable from "@/components/UtilTable";
import type { Product } from "@/sanity.types";
import {
  useCreateCategoryMutation,
  useDeactivateCateMutation,
  useEnableCateMutation,
  useGetCategoryQuery,
  useGetProductQuery,
  useUpdateCategoryMutation,
} from "@/state/api";
import type { Category } from "@/types";
import { useEffect, useMemo, useState } from "react";

type FilterStatus = "all" | "active" | "inactive";

const DashboardCategory = () => {
  const { data: categorys, isLoading, refetch } = useGetCategoryQuery({});
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const { data: products } = useGetProductQuery();
  const [productList, setProductList] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [createCate] = useCreateCategoryMutation();
  const [updateCate] = useUpdateCategoryMutation();
  const [deactivateCate] = useDeactivateCateMutation();
  const [enableCate] = useEnableCateMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (categorys) {
      // Reverse the list to show newest first
      const reversedCategories = [...categorys].reverse();
      setCategoryList(reversedCategories as Category[]);
    }
  }, [categorys]);

  useEffect(() => {
    if (products) {
      setProductList(products as Product[]);
    }
  }, [products]);

  // Filter categories based on status
  const filteredCategories = useMemo(() => {
    if (filterStatus === "all") return categoryList;
    if (filterStatus === "active") return categoryList.filter((category) => category.isActive === true);
    if (filterStatus === "inactive") return categoryList.filter((category) => category.isActive === false);
    return categoryList;
  }, [categoryList, filterStatus]);

  // Calculate statistics
  const totalCategories = categoryList.length;
  const activeCategories = categoryList.filter((c) => c.isActive === true).length;
  const inactiveCategories = categoryList.filter((c) => c.isActive === false).length;
  const filteredCount = filteredCategories.length;

  if (!isMounted) return null;

  const handleCreate = () => {
    setEditingCategory(null);
    setOpenModal(true);
  };

  const handleUpdate = (category: Category) => {
    setEditingCategory(category);
    setOpenModal(true);
  };

  const handleSubmit = async (data: { title: string; description: string; products: string[] }) => {
    try {
      if (editingCategory) {
        console.log("editingCategory", editingCategory);

        await updateCate({ id: editingCategory._id, ...data }).unwrap();
        refetch();
      } else {
        await createCate(data).unwrap();
        refetch();
      }
      setOpenModal(false);
    } catch {}
  };

  return (
    <div className="w-full min-h-screen">
      {isLoading && <Loading />}

      {/* Statistics and Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-6 w-full">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{totalCategories}</div>
            <div className="text-sm text-blue-600">Tổng danh mục</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{activeCategories}</div>
            <div className="text-sm text-green-600">Đang hoạt động</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{inactiveCategories}</div>
            <div className="text-sm text-red-600">Không hoạt động</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{filteredCount}</div>
            <div className="text-sm text-purple-600">Đang hiển thị</div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả ({totalCategories})
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "active" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Hoạt động ({activeCategories})
              </button>
              <button
                onClick={() => setFilterStatus("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "inactive" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Không hoạt động ({inactiveCategories})
              </button>
            </div>
          </div>

          {/* Current filter info */}
          <div className="text-sm text-gray-600">
            {filterStatus === "all" && `Hiển thị tất cả ${totalCategories} danh mục`}
            {filterStatus === "active" && `Hiển thị ${activeCategories} danh mục đang hoạt động`}
            {filterStatus === "inactive" && `Hiển thị ${inactiveCategories} danh mục không hoạt động`}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <UitlTable
          ITEMS_PER_PAGE={10}
          data={filteredCategories?.map((cate) => ({
            ...cate,
            description: cate.description ?? "Không có",
            isActiveValue: cate.isActive,
            products: Array.isArray(cate.products)
              ? cate.products
                  .map((id) => {
                    const product = productList.find((p: Product) => p._id.toString() === id.toString());
                    return product?.name || "Không xác định";
                  })
                  .join(", ")
              : "",

            isActive: (
              <span className={`font-semibold ${cate.isActive ? "text-green-600" : "text-red-600"}`}>
                {cate.isActive ? "Hoạt động" : "Không hoạt động"}
              </span>
            ),
          }))}
          columns={[
            // { key: "_id", label: "ID" },
            { key: "title", label: "Tên" },
            { key: "description", label: "Mô tả" },
            // {
            //   key: "products",
            //   label: "Sản phẩm",
            //   render: (products: string[]) => products.join(", "),
            // },
            {
              key: "reason",
              label: "Lý do",
            },
            {
              key: "isActive",
              label: "Trạng thái",
            },
          ]}
          getIsActive={(row) => row.isActiveValue}
          onCreate={handleCreate}
          onDisable={async (id, reason) => {
            console.log("Đình chỉ category:", id, "lý do:", reason);
            await deactivateCate({ id, reason }).unwrap();
            refetch();
          }}
          onEnable={async (id) => {
            const category = categoryList.find((c) => c._id === id);
            if (category) {
              await enableCate({ id: category._id.toString() }).unwrap();
              refetch();
            }
          }}
          onUpdate={handleUpdate}
        />
      </div>

      {/* Modal tự tạo */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">{editingCategory ? "Cập nhật danh mục" : "Tạo mới danh mục"}</h2>

            <CategoryForm
              initialValues={
                editingCategory
                  ? {
                      title: editingCategory.title,
                      description: editingCategory.description ?? "", // ✅ fallback nếu undefined
                      products: (Array.isArray(editingCategory.products)
                        ? editingCategory.products
                        : [editingCategory.products]
                      )
                        .map((name) => productList.find((p) => p.name === name)?._id)
                        .filter((id): id is string => typeof id === "string"), // ✅ loại undefined, ép kiểu
                    }
                  : {
                      title: "",
                      description: "",
                      products: [],
                    }
              }
              onSubmit={handleSubmit}
            />

            {/* Nút đóng modal */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCategory;
