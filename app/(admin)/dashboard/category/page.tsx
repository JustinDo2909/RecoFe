"use client";
import CategoryForm from "@/app/(admin)/dashboard/category/cateForm";
import Loading from "@/components/Loading";
import UitlTable from "@/components/UtilTable";
import { Product } from "@/sanity.types";
import {
  useCreateCategoryMutation,
  useDeactivateCateMutation,
  useEnableCateMutation,
  useGetCategoryQuery,
  useGetProductQuery,
  useUpdateCategoryMutation,
} from "@/state/api";
import { Category } from "@/types";
import { useEffect, useState } from "react";

const DashboardCategory = () => {
  const { data: categorys, isLoading, refetch } = useGetCategoryQuery({});
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const { data: products } = useGetProductQuery({});
  const [productList, setProductList] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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
      setCategoryList(categorys as Category[]);
    }
  }, [categorys]);

  useEffect(() => {
    if (products) {
      setProductList(products as Product[]);
    }
  }, [products]);

  if (!isMounted) return null;

  const handleCreate = () => {
    setEditingCategory(null);
    setOpenModal(true);
  };

  console.log("productList ", productList);

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
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     await deleteCategory(id).unwrap();
  //   } catch (error) {
  //     console.error("Error deleting category:", error);
  //   }
  // };

  return (
    <div>
      {isLoading && <Loading />}

      <UitlTable
        ITEMS_PER_PAGE={10}
        data={categoryList.map((cate) => ({
          ...cate,
          description: cate.description ?? "Không có",
          isActiveValue: cate.isActive,
          products: Array.isArray(cate.products)
            ? cate.products
                .map((id) => {
                  console.log("id", id);

                  const product = productList.find((p: Product) => p._id.toString() === id.toString());

                  console.log("product", product);

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
          {
            key: "products",
            label: "Sản phẩm",
            render: (products: string[]) => products.join(", "), // <-- thêm dòng này
          },
          {
            key: "reason",
            label: "Lý do",
          },

          {
            key: "isActive",
            label: "Trạng thái",
          },
        ]}
        getIsActive={(row) => row.isActiveValue} // ✅ vẫn hoạt động đúng
        onCreate={handleCreate}
        onDisable={async (id, reason) => {
          console.log("Đình chỉ category:", id, "lý do:", reason);
          await deactivateCate({ id, reason }).unwrap();
        }}
        onEnable={async (id) => {
          const category = categoryList.find((c) => c._id === id);
          if (category) {
            await enableCate({ id: category._id.toString() }).unwrap();
          }
        }}
        onUpdate={handleUpdate}
      />

      {/* Modal tự tạo */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setOpenModal(false)} // click ngoài modal sẽ đóng
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()} // ngăn đóng khi click vào modal
          >
            <h2 className="text-xl font-semibold mb-4">{editingCategory ? "Cập nhật danh mục" : "Tạo mới danh mục"}</h2>

            <CategoryForm
              initialValues={
                editingCategory
                  ? {
                      title: editingCategory.title,
                      description: editingCategory.description,
                      products: (Array.isArray(editingCategory.products)
                        ? editingCategory.products
                        : [editingCategory.products]
                      )
                        .map((name) => productList.find((p) => p.name === name)?._id)
                        .filter(Boolean),
                    }
                  : undefined
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
