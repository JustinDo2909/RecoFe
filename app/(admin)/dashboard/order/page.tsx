"use client";
import Loading from "@/components/Loading";
import OrderTable from "@/components/OrderTable";
import { useGetAllOrderQuery, useGetUsersQuery, useUpdateOrderStatusMutation } from "@/state/api";
import { Order, User } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const statusOrderViMap: Record<string, string> = {
  Processing: "Đang xử lý",
  Shipping: "Đang giao hàng",
  Done: "Hoàn thành",
  "Refund Approved": "Hoàn tiền đã duyệt",
  Cancel: "Đã hủy",
  "Refund Requested": "Yêu cầu hoàn tiền",
  "Refund Rejected": "Từ chối hoàn tiền",
};

const statusColorMap: Record<string, string> = {
  Processing: "text-yellow-500",
  Shipping: "text-blue-500",
  Done: "text-green-500",
  Cancel: "text-red-500",
  "Refund Approved": "text-purple-500",
  "Refund Requested": "text-orange-500",
  "Refund Rejected": "text-gray-500",
};

const statusPaymentViMap: Record<string, string> = {
  Paid: "Đã thanh toán",
  Failed: "Thanh toán thất bại",
  Pending: "Đang thanh toán",
};

const statusPaymentColorMap: Record<string, string> = {
  Paid: "text-green-600",
  Failed: "text-red-600",
  Pending: "text-yellow-600",
};

const formatPriceVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const DashboardOrder = () => {
  const { data: orders, isLoading, refetch } = useGetAllOrderQuery({});
  const { data: users } = useGetUsersQuery({});
  const [OrderList, setOrderList] = React.useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (orders) {
      setOrderList(orders as Order[]);
    }
  }, [orders]);

  useEffect(() => {
    if (users) {
      const map: Record<string, string> = {};
      users.forEach((user: User) => {
        map[user._id] = user.username;
      });
      setUsersMap(map);
    }
  }, [users]);

  if (!isMounted) {
    return null;
  }

  const handleUpdateStatus = async (id: string, status: string, reason?: string) => {
    try {
      const result = await updateOrderStatus({ id, statusOrder: status, reason }).unwrap();
      setOrderList((prev) => prev.map((order) => (order._id === id ? { ...order, statusOrder: status } : order)));
      toast.success(result.message);
      refetch();
    } catch (error) {
      console.error("Update order failed:", error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      {/* Tổng số đơn hàng */}
      <div className="mb-4 font-semibold text-lg">Tổng số đơn hàng: {OrderList.length}</div>

      <OrderTable
        ITEMS_PER_PAGE={10}
        data={[...OrderList].reverse()} // đảo ngược danh sách để mới nhất lên trên
        columns={[
          // { key: "_id", label: "ID" },
          {
            key: "userId",
            label: "Tên người dùng",
            render: (userId: string) => usersMap[userId] || userId,
          },
          {
            key: "totalPrice",
            label: "Giá",
            render: (value: number) => formatPriceVND(value),
          },
          { key: "paymentMethod", label: "Phương thức thanh toán" },

          {
            key: "statusPayment",
            label: "Trạng thái thanh toán",
            render: (value: string) => (
              <span className={`${statusPaymentColorMap[value] || "text-black"} font-bold`}>
                {statusPaymentViMap[value] || value}
              </span>
            ),
          },

          {
            key: "statusOrder",
            label: "Trạng thái đơn hàng",
            render: (value: string) => (
              <span className={`${statusColorMap[value] || "text-black"} font-bold`}>
                {statusOrderViMap[value] || value}
              </span>
            ),
          },
          {
            key: "createdAt",
            label: "Ngày tạo",
            render: (value: string) => formatDate(value),
          },
        ]}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default DashboardOrder;
