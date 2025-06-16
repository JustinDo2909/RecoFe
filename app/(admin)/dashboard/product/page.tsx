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
import type { Product } from "@/types";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

type FilterStatus = "all" | "active" | "inactive";

const DashboardProduct = () => {
  const { data: discountsData } = useGetDiscountsQuery();

  const { data: categorys } = useGetCategoryQuery({});
  const { data: Products, isLoading, refetch } = useGetProductQuery();
  const [ProductList, setProductList] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const [deactivateProduct] = useDeactivateProductMutation();
  const [reactivateProduct] = useReactivateProductMutation();

  const [addDiscountProduct] = useAddDiscountProductMutation();
  const [removeDiscountProduct] = useRemoveDiscountProductMutation();

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const discounts = discountsData?.filter((d) => d.targetType === "product") || [];

  // Format number to VND currency
  const formatVND = (value: number): string => {
    if (isNaN(value) || value === 0) return "0 VND";
    return new Intl.NumberFormat("vi-VN").format(value) + " VND";
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (Products) {
      const reversedProducts = [...Products].reverse();
      setProductList(reversedProducts as Product[]);
    }
  }, [Products]);

  const filteredProducts = useMemo(() => {
    if (filterStatus === "all") return ProductList;
    if (filterStatus === "active") return ProductList.filter((product) => product.isActive === true);
    if (filterStatus === "inactive") return ProductList.filter((product) => product.isActive === false);
    return ProductList;
  }, [ProductList, filterStatus]);

  const totalProducts = ProductList.length;
  const activeProducts = ProductList.filter((p) => p.isActive === true).length;
  const inactiveProducts = ProductList.filter((p) => p.isActive === false).length;
  const filteredCount = filteredProducts.length;

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
    } catch {
      toast.error("Đình chỉ discount thất bại!");
    }
  };

  // Hàm gọi khi user muốn active (kích hoạt) discount
  const handleEnable = async (id: string) => {
    try {
      console.log("id", id);
      const data = await reactivateProduct({ id }).unwrap();
      toast.success(data.message);
      await refetch();
    } catch {
      toast.error("Kích hoạt discount thất bại!");
    }
  };

  const handleAddDiscountProduct = async ({ productId, discountId }: { productId: string; discountId: string }) => {
    try {
      const data = await addDiscountProduct({ productId, discountId });
      toast.success(data.data?.message);
      await refetch();
    } catch {
      toast.error("Kích hoạt discount thất bại!");
    }
  };

  const handleRemoveDiscountProduct = async ({ productId, discountId }: { productId: string; discountId: string }) => {
    try {
      const data = await removeDiscountProduct({
        productId,
        discountId,
      }).unwrap();
      toast.success(data.message);
      await refetch();
    } catch {
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

      {/* Statistics and Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
            <div className="text-sm text-blue-600">Tổng sản phẩm</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            <div className="text-sm text-green-600">Đang hoạt động</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{inactiveProducts}</div>
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
                Tất cả ({totalProducts})
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "active" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Hoạt động ({activeProducts})
              </button>
              <button
                onClick={() => setFilterStatus("inactive")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "inactive" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Không hoạt động ({inactiveProducts})
              </button>
            </div>
          </div>

          {/* Current filter info */}
          <div className="text-sm text-gray-600">
            {filterStatus === "all" && `Hiển thị tất cả ${totalProducts} sản phẩm`}
            {filterStatus === "active" && `Hiển thị ${activeProducts} sản phẩm đang hoạt động`}
            {filterStatus === "inactive" && `Hiển thị ${inactiveProducts} sản phẩm không hoạt động`}
          </div>
        </div>
      </div>

      <UitlTable
        ITEMS_PER_PAGE={10}
        columns={[
          // { key: "_id", label: "ID" },
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
        getIsActive={(row) => (row as any).isActiveValue}
        data={(filteredProducts as any).map((product: any) => {
          const discount = discounts?.find((d) => d._id === product.currentDiscount);
          const categoryNames =
            product?.categories ||
            []
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
            formattedPrice: <span className="font-medium text-blue-600">{formatVND(product.price || 0)}</span>,

            finalPrice: (
              <span className="font-medium text-green-600">{formatVND(product.finalPrice || product.price || 0)}</span>
            ),
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
            onAddDiscount={handleAddDiscountProduct}
            onRemoveDiscount={handleRemoveDiscountProduct}
            discountList={discounts}
            initialValues={editingProduct || {}}
            categoriesOptions={categorys || []}
            currentDiscountCode={
              typeof editingProduct?.currentDiscount === "string"
                ? editingProduct.currentDiscount
                : typeof editingProduct?.currentDiscount === "object" && editingProduct.currentDiscount?.code
                  ? editingProduct.currentDiscount.code
                  : ""
            }
            onSubmit={async (data) => {
              try {
                if (editingProduct?._id) {
                  // Nếu có _id, tức là đang update sản phẩm
                  const res = await updateProduct({
                    id: editingProduct._id,
                    data,
                  }).unwrap();
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
