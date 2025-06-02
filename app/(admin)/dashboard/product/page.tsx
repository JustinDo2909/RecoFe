"use client";

import ProductForm from "@/app/(admin)/dashboard/product/productForm";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import UitlTable from "@/components/UtilTable";
import {
  useAddDiscountProductMutation,
  useCreateProductMutation,
  useDeactivateProductMutation,
  useGetCategoryQuery,
  useGetDiscountsQuery,
  useGetProductQuery,
  useReactivateProductMutation,
  useRemoveDiscountProductMutation,
  useUpdateProductMutation,
} from "@/state/api";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DashboardProduct = () => {
  const { data: discountsData } = useGetDiscountsQuery({});

  const { data: categorys } = useGetCategoryQuery({});
  const { data: Products, isLoading, refetch } = useGetProductQuery({});
  const [ProductList, setProductList] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [deactivateProduct] = useDeactivateProductMutation();
  const [reactivateProduct] = useReactivateProductMutation();

  const [addDiscountProduct] = useAddDiscountProductMutation();
  const [removeDiscountProduct] = useRemoveDiscountProductMutation();

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const discounts = discountsData?.filter((d) => d.targetType === "product") || [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (Products) {
      setProductList(Products as Product[]);
    }
  }, [Products]);

  if (!isMounted) return null;

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleUpdate = (product: Product) => {
    console.log("product", product);

    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDisable = async (id: string, reason: string) => {
    try {
      console.log("id", id, "reason", reason);

      const data = await deactivateProduct({ id, reason }).unwrap();

      toast.success(data.message);

      await refetch();
    } catch (error) {
      toast.error("Đình chỉ discount thất bại!");
    }
  };

  // Hàm gọi khi user muốn active (kích hoạ t) discount
  const handleEnable = async (id: string) => {
    try {
      console.log("id", id);
      const data = await reactivateProduct({ id }).unwrap();
      toast.success(data.message);
      await refetch();
    } catch (error) {
      toast.error("Kích hoạt discount thất bại!");
    }
  };

  const handleAddDiscountProduct = async ({ productId, discountId }: { productId: string; discountId: string }) => {
    try {
      const data = await addDiscountProduct({ productId, discountId });
      toast.success(data.data?.message);
      await refetch();
    } catch (error) {
      toast.error("Kích hoạt discount thất bại!");
    }
  };

  const handleRemoveDiscountProduct = async ({ productId, discountId }: { productId: string; discountId: string }) => {
    try {
      const data = await removeDiscountProduct({ productId, discountId }).unwrap();
      toast.success(data.message);
      await refetch();
    } catch (error) {
      toast.error("Kích hoạt discount thất bại!");
    }
  };

  return (
    <div>
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}

      <UitlTable
        ITEMS_PER_PAGE={10}
        columns={[
          { key: "_id", label: "ID" },
          { key: "name", label: "Tên sản phẩm" },
          { key: "price", label: "Giá" },
          { key: "picture", label: "Hình ảnh" },
          { key: "description", label: "Mô tả" },
          { key: "stock", label: "Kho" },
          { key: "categoryNames", label: "Thể loại" },
          { key: "discountCode", label: "Mã giảm giá hiện tại" },
          { key: "createdAt", label: "Ngày tạo" },
          { key: "updatedAt", label: "Ngày cập nhật" },
          { key: "finalPrice", label: "Giá cuối cùng" },
          { key: "editby", label: "Chỉnh sửa bởi" },
          { key: "isActive", label: "Trạng thái" },
          { key: "deactivationReason", label: "Lý do" },
        ]}
        getIsActive={(row) => row.isActiveValue}
        data={ProductList.map((product) => {
          const discount = discounts?.find((d) => d._id === product.currentDiscount);
          const categoryNames = product.categories
            .map((catId) => {
              const cat = categorys?.find((c) => c._id === catId);
              return cat ? cat.title : catId;
            })
            .join(", ");
          return {
            ...product,
            isActiveValue: product.isActive,
            isActive: (
              <span className={`font-semibold ${product.isActive ? "text-green-600" : "text-red-600"}`}>
                {product.isActive ? "Hoạt động" : "Không hoạt động"}
              </span>
            ),
            deactivatedReason: product.deactivationReason || "Không có lý do",
            categoryNames: categoryNames,
            discountCode: discount?.code || "Không có",
          };
        })}
        onDisable={handleDisable}
        onEnable={handleEnable}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <ProductForm
            onAddDiscount={handleAddDiscountProduct} // ✅ đúng chiều thêm
            onRemoveDiscount={handleRemoveDiscountProduct} // ✅ đúng chiều xóa
            discountList={discounts}
            initialValues={editingProduct || {}}
            categoriesOptions={categorys || []}
            currentDiscountCode={editingProduct?.currentDiscount ? editingProduct?.currentDiscount : ""} // Truyền id discount hoặc rỗng string
            onSubmit={async (data) => {
              try {
                if (editingProduct?._id) {
                  // Nếu có _id, tức là đang update sản phẩm
                  const res = await updateProduct({ id: editingProduct._id, data }).unwrap();
                  toast.success(res.message || "Cập nhật sản phẩm thành công!");
                } else {
                  // Nếu không có _id, tạo sản phẩm mới
                  const res = await createProduct(data).unwrap();
                  toast.success(res.message || "Tạo sản phẩm thành công!");
                }
                setShowForm(false);
                await refetch(); // Làm mới danh sách sản phẩm
              } catch (error: any) {
                toast.error(error?.data?.errors || "Đã xảy ra lỗi!");
              }
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default DashboardProduct;
