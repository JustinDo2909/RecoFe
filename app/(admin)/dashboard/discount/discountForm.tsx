"use client";

import { useGetAllOrderQuery, useGetProductQuery } from "@/state/api";
import { Discount } from "@/types";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Hàm chuyển dd/MM/yyyy thành yyyy-MM-dd
const formatDateDMYtoISO = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";
  const [d, m, y] = parts;
  const day = d.padStart(2, "0");
  const month = m.padStart(2, "0");
  return `${y}-${month}-${day}`;
};

// Chuẩn hóa discountType từ tiếng Việt sang key
const mapDiscountType = (type: string) => {
  if (!type) return "percentage"; // default
  const lower = type.toLowerCase();
  if (lower.includes("phần trăm")) return "percentage";
  if (lower.includes("giá cố định")) return "fixed";
  return "percentage";
};

// Chuẩn hóa targetType (giả sử mặc định là product)
const mapTargetType = (type: string) => {
  if (!type) return "product";
  const lower = type.toLowerCase();
  if (lower === "product" || lower === "sản phẩm") return "product";
  if (lower === "order" || lower === "đơn hàng") return "order";
  return "product";
};

const DiscountForm: React.FC<{
  initialValues: Partial<Discount>;
  onSubmit: (data: Discount) => void;
  onCancel: () => void;
}> = ({ initialValues, onSubmit, onCancel }) => {
  const { data: fetchedProducts } = useGetProductQuery();
  const { data: fetchedOrders } = useGetAllOrderQuery();

  // Chuẩn hóa default values
  const defaultValues: any = {
    ...initialValues,
    discountType: mapDiscountType(initialValues.discountType as string),
    startDate: formatDateDMYtoISO(initialValues.startDate ?? ""),
    endDate: formatDateDMYtoISO(initialValues.endDate ?? ""),
    targetType: mapTargetType(initialValues.targetType as string),
    name: initialValues.name ?? "",
    code: initialValues.code ?? "",
    description: initialValues.description ?? "",
    value: initialValues.value ?? 0,
    applicableProducts: initialValues.applicableProducts ?? [],
    applicableOrders: initialValues.applicableOrders ?? [],
    isActive: initialValues.isActive ?? false,
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Discount>({
    defaultValues,
  });

  const targetType = watch("targetType");

  // State danh sách sản phẩm và đơn hàng hiện có để chọn
  const [productsList, setProductsList] = useState<
    { _id: string; name: string }[]
  >([]);
  const [ordersList, setOrdersList] = useState<{ _id: string; id: string }[]>(
    [],
  );

  // State lựa chọn sản phẩm và đơn hàng (checkbox)
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    defaultValues.applicableProducts,
  );
  const [selectedOrders, setSelectedOrders] = useState<string[]>(
    defaultValues.applicableOrders ?? [],
  );

  // isEditMode: nếu initialValues có targetType thì không cho đổi
  const isEditMode = !!initialValues?.targetType;

  // Khi targetType hoặc fetched data thay đổi, cập nhật list tương ứng
  useEffect(() => {
    if (targetType === "product") {
      setProductsList((fetchedProducts as any) ?? []);
      setOrdersList([]);
      setSelectedOrders([]);
    } else if (targetType === "order") {
      setOrdersList((fetchedOrders as any) ?? []);
      setProductsList([]);
      setSelectedProducts([]);
    } else {
      setProductsList([]);
      setOrdersList([]);
      setSelectedProducts([]);
      setSelectedOrders([]);
    }
  }, [targetType, fetchedProducts, fetchedOrders]);

  // Cập nhật giá trị applicableProducts trong form khi selectedProducts thay đổi
  useEffect(() => {
    setValue("applicableProducts", selectedProducts);
  }, [selectedProducts, setValue]);

  // Cập nhật giá trị applicableOrders trong form khi selectedOrders thay đổi
  useEffect(() => {
    setValue("applicableOrders", selectedOrders);
  }, [selectedOrders, setValue]);

  // Xử lý toggle checkbox sản phẩm
  const onProductToggle = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    const cleaned = selectedProducts.filter((id) => id !== "");
    setValue("applicableProducts", cleaned);
  }, [selectedProducts, setValue]);

  // Xử lý toggle checkbox đơn hàng
  const onOrderToggle = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 max-w-lg mx-auto bg-white shadow rounded overflow-auto max-h-[90vh]"
    >
      {/* Tên giảm giá */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Tên giảm giá</label>
        <input
          {...register("name", { required: "Tên giảm giá là bắt buộc" })}
          className="w-full border rounded px-3 py-2"
          placeholder="Nhập tên giảm giá"
        />
        {errors.name && (
          <p className="text-red-600 mt-1 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Mã */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Mã</label>
        <input
          {...register("code")}
          className="w-full border rounded px-3 py-2"
          placeholder="Nhập mã giảm giá"
        />
      </div>

      {/* Mô tả */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Mô tả</label>
        <textarea
          {...register("description")}
          className="w-full border rounded px-3 py-2"
          rows={3}
          placeholder="Mô tả chi tiết về giảm giá"
        />
      </div>

      {/* Loại giảm giá */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Loại giảm giá</label>
        <select
          {...register("discountType", { required: true })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="percentage">Phần trăm</option>
          <option value="fixed">Giá cố định</option>
        </select>
      </div>

      {/* Giá trị */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Giá trị</label>
        <input
          type="number"
          {...register("value", {
            required: "Giá trị là bắt buộc",
            min: { value: 0, message: "Giá trị phải lớn hơn hoặc bằng 0" },
          })}
          className="w-full border rounded px-3 py-2"
          placeholder="Nhập giá trị giảm"
        />
        {errors.value && (
          <p className="text-red-600 mt-1 text-sm">{errors.value.message}</p>
        )}
      </div>

      {/* Ngày bắt đầu */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Ngày bắt đầu</label>
        <input
          type="date"
          {...register("startDate", { required: "Ngày bắt đầu là bắt buộc" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.startDate && (
          <p className="text-red-600 mt-1 text-sm">
            {errors.startDate.message}
          </p>
        )}
      </div>

      {/* Ngày kết thúc */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Ngày kết thúc</label>
        <input
          type="date"
          {...register("endDate", { required: "Ngày kết thúc là bắt buộc" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.endDate && (
          <p className="text-red-600 mt-1 text-sm">{errors.endDate.message}</p>
        )}
      </div>

      {/* Loại đối tượng áp dụng */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Loại đối tượng áp dụng
        </label>

        {isEditMode ? (
          <>
            <p className="px-3 py-2 border rounded bg-gray-100">
              {defaultValues.targetType === "product" ? "Sản phẩm" : "Đơn hàng"}
            </p>
            <input
              type="hidden"
              value={defaultValues.targetType}
              {...register("targetType")}
            />
          </>
        ) : (
          <>
            <select
              {...register("targetType", {
                required: "Loại đối tượng là bắt buộc",
              })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="product">Sản phẩm</option>
              <option value="order">Đơn hàng</option>
            </select>
            {errors.targetType && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.targetType.message}
              </p>
            )}
          </>
        )}
      </div>

      {/* Danh sách sản phẩm hoặc đơn hàng chọn lựa */}
      {targetType === "product" && productsList.length > 0 && (
        <div className="mb-4 border p-3 rounded max-h-48 overflow-auto">
          <label className="block mb-2 font-semibold">
            Chọn sản phẩm áp dụng
          </label>
          {productsList.map((p) => (
            <label
              key={p._id}
              className="flex items-center mb-1 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedProducts.includes(p._id)}
                onChange={() => onProductToggle(p._id)}
                className="mr-2"
              />
              {p.name}
            </label>
          ))}
        </div>
      )}

      {targetType === "order" && ordersList.length > 0 && (
        <div className="mb-4 border p-3 rounded max-h-48 overflow-auto">
          <label className="block mb-2 font-semibold">
            Chọn đơn hàng áp dụng
          </label>
          {ordersList.map((o) => (
            <label
              key={o._id}
              className="flex items-center mb-1 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedOrders.includes(o._id)}
                onChange={() => onOrderToggle(o._id)}
                className="mr-2"
              />
              {o._id}
            </label>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default DiscountForm;
