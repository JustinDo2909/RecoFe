"use client";
import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import RequestTable from "@/components/ui/RequestTable";
import { useGetAllRequestQuery, useUpdateStatusRequestMutation } from "@/state/api";
import { Request } from "@/types";
import React, { useEffect, useState } from "react";

interface RequestRefundModel {
  _id: string;
  userName: string;
  orderId: string;
  orderAmount: number;
  paymentMethod: string;
  message: string;
  status: "Pending" | "Approved" | "Rejected";
  orderStatus: string;
  createdAt: string;
  statusElement: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
}

const orderStatusVN: Record<string, string> = {
  Shipping: "Đang vận chuyển",
  Done: "Hoàn thành",
  "Refund Approved": "Hoàn tiền được chấp thuận",
  Cancel: "Đã hủy",
  "Refund Requested": "Yêu cầu hoàn tiền",
  "Refund Rejected": "Yêu cầu hoàn tiền bị từ chối",
};

const requestStatusVN: Record<string, string> = {
  Pending: "Đang chờ duyệt",
  Approved: "Đã duyệt",
  Rejected: "Đã từ chối",
};

const requestStatusColor: Record<string, string> = {
  Pending: "orange",
  Approved: "green",
  Rejected: "red",
};

const DashboardRequest = () => {
  const { data: requests, isLoading } = useGetAllRequestQuery({});
  const [requestList, setRequestList] = React.useState<RequestRefundModel[]>([]);
  const [updateStatus] = useUpdateStatusRequestMutation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (requests) {
      console.log("req", requests);

      const flattened = (requests as Request[])
        .map((item) => {
          const status = item.status;
          const color = requestStatusColor[status] || "black";
          return {
            ...item,
            userName: item.user?.username || "No Name",
            orderId: item.order?._id || "N/A",
            orderAmount: item.order?.totalPrice
              ? item.order.totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              : "0 ₫",
            paymentMethod: item.order?.paymentMethod || "N/A",
            orderStatus: orderStatusVN[String(item.order?.statusOrder)] || "N/A",
            statusVN: requestStatusVN[status] || status,
            statusElement: <span style={{ color, fontWeight: "bold" }}>{requestStatusVN[status] || status}</span>,
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRequestList(flattened);
    }
  }, [requests]);

  const handleUpdateRequestStatus = async (id: string, status: string) => {
    console.log(id, status);

    await updateStatus({ id, status }).unwrap();
  };

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      <RequestTable
        ITEMS_PER_PAGE={10}
        data={requestList}
        columns={[
          // { key: "_id", label: "Mã yêu cầu" },
          { key: "userName", label: "Tên người dùng" },
          { key: "orderId", label: "Mã đơn hàng" },
          { key: "orderAmount", label: "Số tiền đơn hàng" },
          { key: "paymentMethod", label: "Phương thức thanh toán" },
          { key: "message", label: "Lý do hoàn tiền" },
          { key: "orderStatus", label: "Trạng thái đơn hàng" },
          { key: "statusElement", label: "Trạng thái yêu cầu" },

          { key: "createdAt", label: "Ngày tạo" },
        ]}
        onUpdateStatus={handleUpdateRequestStatus}
      />
    </div>
  );
};

export default DashboardRequest;
