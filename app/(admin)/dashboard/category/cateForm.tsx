import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetProductQuery } from "@/state/api";
import { Product } from "@/types";

interface CategoryFormProps {
  initialValues?: {
    title: string;
    description: string;
    products: string[];
  };
  onSubmit: (data: CategoryFormData) => void;
}

interface CategoryFormData {
  title: string;
  description: string;
  products: string[]; // mảng product _id đã chọn
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const { data: Products, isLoading } = useGetProductQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      products: [],
      title: "",
      description: "",
    },
  });

  const watchedProducts = watch("products") || [];

  useEffect(() => {
    if (initialValues && Products) {
      setValue("title", initialValues.title);
      setValue("description", initialValues.description);

      const productsArray = Array.isArray(initialValues.products)
        ? initialValues.products
            .map((p) => {
              const isId = Products.some((prod) => prod._id === p);
              if (isId) return p;
              const found = Products.find((prod) => prod.name === p);
              return found?._id || null;
            })
            .filter((id): id is string => id !== null)
        : [];

      setValue("products", productsArray);
    }
  }, [initialValues, Products, setValue]);

  const onFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  if (isLoading) return <div>Loading products...</div>;

  // Hàm xử lý toggle checkbox thủ công (cần thiết để update mảng products)
  const toggleProduct = (productId: string) => {
    if (watchedProducts.includes(productId)) {
      // Bỏ chọn sản phẩm
      setValue(
        "products",
        watchedProducts.filter((id) => id !== productId),
      );
    } else {
      // Chọn thêm sản phẩm
      setValue("products", [...watchedProducts, productId]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên danh mục</label>
        <input
          type="text"
          {...register("title", { required: "Vui lòng nhập tên danh mục" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          rows={3}
          {...register("description", { required: "Vui lòng nhập mô tả" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Products với checkbox */}
      <div>
        <label className="block text-sm font-medium mb-1">Sản phẩm</label>
        <div className="max-h-48 overflow-auto border rounded p-2">
          {(Products || []).map((product: Product) => {
            const checked = watchedProducts.includes(product._id || "");
            return (
              <label
                key={product._id}
                className="flex items-center space-x-2 mb-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={product._id}
                  checked={checked}
                  onChange={() => toggleProduct(product._id || "")}
                />
                <span>{product.name}</span>
              </label>
            );
          })}
        </div>
        {errors.products && (
          <p className="text-red-500 text-sm mt-1">{errors.products.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {initialValues ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
