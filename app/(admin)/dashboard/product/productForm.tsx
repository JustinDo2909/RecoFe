"use client";

import type { Category, Discount } from "@/types";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  rating: number;
  location: string;
  stock: number;
  categories: string[];
  picture?: File | string | null;
  _id: string;
}

interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  categoriesOptions: Category[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  currentDiscountCode?: string;
  onAddDiscount: (payload: { productId: string; discountId: string }) => void;
  onRemoveDiscount: (payload: { productId: string; discountId: string }) => void;
  discountList?: Discount[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues = {},
  categoriesOptions,
  onSubmit,
  onCancel,
  currentDiscountCode,
  onRemoveDiscount,
  onAddDiscount,
  discountList = [],
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      price: initialValues.price ?? 0,
      rating: initialValues.rating ?? 0,
      location: initialValues.location || "",
      stock: initialValues.stock ?? 0,
      categories: initialValues.categories || [],
      picture: initialValues.picture || null,
    },
  });

  const [showDiscountDropdown, setShowDiscountDropdown] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [priceDisplay, setPriceDisplay] = useState<string>("");

  const selectedCategorys = watch("categories") || [];
  const profilePictureFile = watch("picture");
  const currentPrice = watch("price");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Format number to VND currency
  const formatVND = (value: number): string => {
    if (isNaN(value) || value === 0) return "";
    return new Intl.NumberFormat("vi-VN").format(value) + " VND";
  };

  // Parse VND string back to number
  const parseVND = (value: string): number => {
    if (!value) return 0;
    // Remove "VND", spaces, and dots, then convert to number
    const numericValue = value.replace(/[^\d]/g, "");
    return Number.parseInt(numericValue) || 0;
  };

  // Update display when price changes
  useEffect(() => {
    if (currentPrice !== undefined) {
      setPriceDisplay(formatVND(currentPrice));
    }
  }, [currentPrice]);

  // Handle price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseVND(inputValue);

    // Update the actual form value
    setValue("price", numericValue, { shouldValidate: true });

    // Update display value
    setPriceDisplay(formatVND(numericValue));
  };

  const onCategoryToggle = (category: string) => {
    const current = getValues("categories") || [];
    if (current.includes(category)) {
      setValue(
        "categories",
        current.filter((c) => c !== category),
        { shouldValidate: true, shouldDirty: true }
      );
    } else {
      setValue("categories", [...current, category], { shouldValidate: true, shouldDirty: true });
    }
  };

  const confirmRemoveDiscount = () => {
    if (window.confirm("Bạn chắc chắn muốn xóa mã giảm giá?") && currentDiscountCode) {
      onRemoveDiscount?.({ productId: initialValues._id as string, discountId: currentDiscountCode });
    }
  };

  useEffect(() => {
    if (profilePictureFile instanceof File) {
      const url = URL.createObjectURL(profilePictureFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof profilePictureFile === "string") {
      setPreviewUrl(profilePictureFile);
    } else {
      setPreviewUrl(null);
    }
  }, [profilePictureFile]);

  // Danh sách danh mục đã chọn ở đầu
  const sortedCategories = useMemo(() => {
    const selected = categoriesOptions.filter((cat) => selectedCategorys.includes(cat._id));
    const others = categoriesOptions.filter((cat) => !selectedCategorys.includes(cat._id));
    return [...selected, ...others];
  }, [categoriesOptions, selectedCategorys]);

  const visibleCategories = showAllCategories ? sortedCategories : sortedCategories.slice(0, 3);
  const discount = discountList?.find((d) => d._id === currentDiscountCode);

  const internalSubmit = (data: any) => {
    console.log("Submit categories:", data.categories);
    console.log("Submit price:", data.price); // This will be the numeric value
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", data.price.toString());
    formData.append("rating", data.rating.toString());
    formData.append("location", data.location || "");
    formData.append("stock", data.stock.toString());
    data.categories.forEach((cat: any) => formData.append("categories[]", cat));

    if (data.picture && data.picture instanceof File) {
      formData.append("profilePicture", data.picture);
    } else if (typeof data.picture === "string") {
      console.log("picture", data.picture);
      formData.append("profilePicture", data.picture);
    }

    console.log("formData", formData);
    onSubmit(formData);
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <form
        onSubmit={handleSubmit(internalSubmit)}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-3xl mx-auto space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông tin sản phẩm</h2>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Tên sản phẩm</label>
          <input
            {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Nhập tên sản phẩm"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Mô tả</label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            rows={3}
            placeholder="Mô tả sản phẩm"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Giá (VND)</label>
            <input
              type="text"
              value={priceDisplay}
              onChange={handlePriceChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="0 VND"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            {/* Hidden input for actual numeric value */}
            <input
              type="hidden"
              {...register("price", {
                required: "Giá là bắt buộc",
                min: { value: 0, message: "Giá phải lớn hơn hoặc bằng 0" },
              })}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Tồn kho</label>
            <input
              type="number"
              {...register("stock", {
                min: { value: 0, message: "Không được âm" },
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Vị trí</label>
          <input
            {...register("location")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Nhập vị trí"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block font-medium mb-2">Danh mục sản phẩm</label>
          <div className="flex flex-wrap gap-2">
            {visibleCategories
              .filter((cat) => cat.isActive)
              .map((cat) => {
                const isSelected = selectedCategorys.includes(cat._id);
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => onCategoryToggle(cat._id)}
                    className={`px-4 py-1 rounded-full text-sm border transition ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            {sortedCategories.length > 3 && (
              <div className="ml-1 space-x-2">
                {!showAllCategories && (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories(true)}
                    className="text-blue-500 underline text-sm"
                  >
                    + Thêm
                  </button>
                )}

                {showAllCategories && (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories(false)}
                    className="text-blue-500 underline text-sm"
                  >
                    Ẩn bớt
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block font-medium mb-1">Ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue("picture", file || null);
            }}
          />
          {previewUrl && (
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Ảnh xem trước"
              className="mt-3 rounded-md border max-h-60 object-contain"
            />
          )}
        </div>

        {/* Discount */}
        <div>
          <label className="block font-medium mb-1">Mã giảm giá</label>
          {currentDiscountCode ? (
            <div className="flex items-center justify-between bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">{discount?.code}</span>
              <button type="button" onClick={confirmRemoveDiscount} className="text-red-500 hover:underline text-sm">
                Xóa mã
              </button>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setShowDiscountDropdown((prev) => !prev)}
                className="text-blue-600 hover:underline text-sm"
              >
                + Thêm mã giảm giá
              </button>

              <div className="mt-2">
                {showDiscountDropdown && (
                  <select
                    onChange={(e) => {
                      const discountId = e.target.value;
                      const productId = initialValues._id;
                      const selected = discountList.find((d) => d._id === discountId);

                      if (productId && selected) {
                        onAddDiscount?.({ productId, discountId });
                        setSelectedDiscount(selected);
                        setShowDiscountDropdown(false);
                      }
                    }}
                    className="border border-gray-300 rounded-md p-2 w-full max-h-48 overflow-y-auto"
                    size={6}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Chọn mã giảm giá
                    </option>
                    {discountList.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                )}
                {selectedDiscount && (
                  <div className="mt-2 text-sm text-green-600">
                    Mã đã chọn: <span className="font-semibold">{selectedDiscount.code}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition">
            Hủy
          </button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Lưu sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
