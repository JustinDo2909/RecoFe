"use client";
import DiscountForm from "@/app/(admin)/dashboard/discount/discountForm";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import UitlTable from "@/components/UtilTable";
import {
  useActiveDiscountMutation,
  useCreateDiscountOrderMutation,
  useCreateDiscountProductMutation,
  useDisableDiscountMutation,
  useGetDiscountsQuery,
  useUpdateDiscountOrderMutation,
  useUpdateDiscountProductMutation,
} from "@/state/api";

import { Discount, DiscountRequestOrder, DiscountRequestProduct } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const DiscountManager = () => {
  const { data: discounts, isLoading, refetch } = useGetDiscountsQuery({});
  const [disableDiscount] = useDisableDiscountMutation();
  const [activeDiscount] = useActiveDiscountMutation();

  const [createDiscountOrder] = useCreateDiscountOrderMutation();
  const [createDiscountProduct] = useCreateDiscountProductMutation();

  const [updateDiscountProduct] = useUpdateDiscountProductMutation();
  const [updateDiscountOrder] = useUpdateDiscountOrderMutation();

  const [discountList, setDiscountList] = useState<Discount[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (discounts) {
      setDiscountList(discounts as Discount[]);
    }
  }, [discounts]);

  if (!isMounted) {
    return null;
  }

  const handleDisable = async (id: string, reason: string) => {
    try {
      console.log("id", id, "reason", reason);

      const data = await disableDiscount({ id, reason }).unwrap();
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
      const data = await activeDiscount({ id }).unwrap();
      toast.success(data.message);
      await refetch();
    } catch (error) {
      toast.error("Kích hoạt discount thất bại!");
    }
  };

  const emptyDiscount: Discount = {
    _id: "",
    name: "",
    description: "",
    discountType: "",
    value: 0,
    applicableProducts: [""],
    applicableOrders: [""],
    startDate: "",
    endDate: "",
    code: "",
    targetType: "",
    isActive: true,
  };

  const handleCreate = () => {
    setEditingDiscount(emptyDiscount);
    setShowForm(true);
  };

  const handleUpdate = (discount: Discount) => {
    setEditingDiscount(discount);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDiscount(null);
  };

  const handleClose = () => {
    setEditingDiscount(emptyDiscount);
    setShowForm(false);
  };

  const handleSubmit = async (data: Discount) => {
    console.log("data", data);

    try {
      if (editingDiscount && editingDiscount._id) {
        // Tạo payload dựa trên data đã nhập
        if (data.targetType === "product") {
          const payload: DiscountRequestProduct = {
            name: data.name,
            description: data.description || "",
            discountType: data.discountType,
            value: data.value,
            applicableProducts: data.applicableProducts,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code || "",
            targetType: data.targetType,
          };

          console.log("payload của EditProduct", payload);

          // Gọi API update product
          await updateDiscountProduct({ id: editingDiscount._id, body: payload }).unwrap();
          toast.success("Cập nhật discount sản phẩm thành công");
          handleClose();

          await refetch();
        } else if (data.targetType === "order") {
          const payload: DiscountRequestOrder = {
            name: data.name,
            description: data.description || "",
            discountType: data.discountType,
            value: data.value,
            applicableOrders: data.applicableOrders,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code || "",
            targetType: data.targetType,
          };
          console.log("payload nè EditOrder", payload);

          // Gọi API update order
          await updateDiscountOrder({ id: editingDiscount._id, body: payload }).unwrap();
          toast.success("Cập nhật discount đơn hàng thành công");
          handleClose();

          await refetch();
        }
        // // Sau khi update xong, đóng form, refetch dữ liệu
        setShowForm(false);
        setEditingDiscount(null);
      } else {
        if (data.targetType === "product") {
          console.log("data nè CreatePRoduct", data);
          const payload: DiscountRequestProduct = {
            name: data.name,
            description: data.description || "",
            discountType: data.discountType,
            value: data.value,
            applicableProducts: data.applicableProducts,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code || "",
            targetType: data.targetType,
          };

          console.log("payload của Create Product", payload);

          await createDiscountProduct(payload).unwrap();
          toast.success("Tạo discount sản phẩm thành công");
          await refetch();
          handleClose();
        } else if (data.targetType === "order") {
          const payload: DiscountRequestOrder = {
            name: data.name,
            description: data.description || "",
            discountType: data.discountType,
            value: data.value,
            applicableOrders: data.applicableOrders,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code || "",
            targetType: data.targetType,
          };

          console.log("payload của Create Order", payload);

          await createDiscountOrder(payload).unwrap();
          toast.success("Tạo discount đơn hàng thành công");
          handleClose();
          await refetch();
        }
        setShowForm(false);
        setEditingDiscount(null);
      }
    } catch (error) {
      console.log("error", error);

      toast.error("Tạo hoặc cập nhật discount thất bại");
    }
  };

  // Xử lý dữ liệu trước khi truyền vào bảng
  const processedDiscounts = discountList.map((discount) => ({
    ...discount,
    discountType: discount.discountType === "percentage" ? "Phần trăm" : "Giá cố định",
    targetType:
      discount.targetType === "product" ? "Sản phẩm" : discount.targetType === "order" ? "Đơn hàng" : "Chưa có",
    startDate: new Date(discount.startDate).toLocaleDateString("vi-VN"),
    endDate: new Date(discount.endDate).toLocaleDateString("vi-VN"),
    isActive: (
      <span className={`font-semibold ${discount.isActive ? "text-green-600" : "text-red-600"}`}>
        {discount.isActive ? "Hoạt động" : "Không hoạt động"}
      </span>
    ),
    isActiveInData: discount.isActive ? true : false,
    reason: discount.reason ? discount.reason : "Không có lý do",
  }));

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
          { key: "name", label: "Tên" },
          { key: "code", label: "Mã" },
          { key: "description", label: "Mô tả" },
          { key: "discountType", label: "Loại giảm giá" },
          { key: "value", label: "Giá trị" },
          { key: "targetType", label: "Loại" },
          { key: "startDate", label: "Ngày bắt đầu" },
          { key: "endDate", label: "Ngày kết thúc" },
          { key: "isActive", label: "Trạng thái" },
          { key: "reason", label: "Lý do" },
        ]}
        getIsActive={(row) => {
          console.log("getIsActive called with row:", row._id, "isActive:", row.isActiveInData);
          return Boolean(row.isActiveInData);
        }}
        data={processedDiscounts}
        onDisable={handleDisable}
        onEnable={handleEnable}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {showForm && editingDiscount && (
        <Modal onClose={handleClose}>
          <DiscountForm initialValues={editingDiscount} onSubmit={handleSubmit} onCancel={handleCancel} />
        </Modal>
      )}
    </div>
  );
};

export default DiscountManager;
