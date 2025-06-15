"use client";

import type React from "react";

import Loading from "@/components/Loading";
import RequestTable from "@/components/ui/RequestTable";
import { useGetAllRequestQuery, useUpdateStatusRequestMutation } from "@/state/api";
import type { Request } from "@/types";
import { FileText, Clock, CheckCircle, XCircle, Search, Filter, DollarSign, AlertCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

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
  statusElement: React.ReactElement;
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

type FilterStatus = "all" | "Pending" | "Approved" | "Rejected";

const DashboardRequest = () => {
  const { data: requests, isLoading, refetch } = useGetAllRequestQuery({});
  const [requestList, setRequestList] = useState<RequestRefundModel[]>([]);
  const [updateStatus] = useUpdateStatusRequestMutation();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

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
            orderAmount: item.order?.totalPrice || 0,
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

  // Filter requests based on search term and status
  const filteredRequests = useMemo(() => {
    return requestList.filter((request) => {
      // Filter by status
      const statusMatch = filterStatus === "all" || request.status === filterStatus;

      // Filter by search term
      const searchMatch =
        searchTerm === "" ||
        request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [requestList, filterStatus, searchTerm]);

  // Calculate statistics
  const totalRequests = requestList.length;
  const pendingRequests = requestList.filter((r) => r.status === "Pending").length;
  const approvedRequests = requestList.filter((r) => r.status === "Approved").length;
  const rejectedRequests = requestList.filter((r) => r.status === "Rejected").length;
  const filteredCount = filteredRequests.length;

  // Calculate total refund amount
  const totalRefundAmount = requestList
    .filter((r) => r.status === "Approved")
    .reduce((sum, request) => sum + request.orderAmount, 0);

  // Format VND currency
  const formatVND = (value: number): string => {
    if (isNaN(value) || value === 0) return "0 VND";
    return new Intl.NumberFormat("vi-VN").format(value) + " VND";
  };

  const handleUpdateRequestStatus = async (id: string, status: string) => {
    try {
      console.log(id, status);
      await updateStatus({ id, status }).unwrap();
      toast.success("Cập nhật trạng thái thành công!");
      refetch();
    } catch (error) {
      console.error("Update request status failed:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full min-h-screen">
      {isLoading && <Loading />}

      {/* Statistics and Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-6 w-full">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 w-full">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalRequests}</div>
                <div className="text-sm text-blue-600">Tổng yêu cầu</div>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{pendingRequests}</div>
                <div className="text-sm text-orange-600">Chờ duyệt</div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
                <div className="text-sm text-green-600">Đã duyệt</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{rejectedRequests}</div>
                <div className="text-sm text-red-600">Đã từ chối</div>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-purple-600">{formatVND(totalRefundAmount)}</div>
                <div className="text-sm text-purple-600">Tổng hoàn tiền</div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm yêu cầu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Pending">Chờ duyệt</option>
                <option value="Approved">Đã duyệt</option>
                <option value="Rejected">Đã từ chối</option>
              </select>
            </div>
          </div>

          {/* Current filter info */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {searchTerm === "" && filterStatus === "all"
              ? `Hiển thị tất cả ${totalRequests} yêu cầu`
              : `Tìm thấy ${filteredCount} kết quả`}
          </div>
        </div>
      </div>

      {/* Request Table */}
      <div className="w-full overflow-x-auto">
        <RequestTable
          ITEMS_PER_PAGE={10}
          data={filteredRequests.map((request) => ({
            ...request,
            orderAmount: <span className="font-semibold text-green-600">{formatVND(request.orderAmount)}</span>,
            userName: <span className="font-medium text-gray-900">{request.userName}</span>,
            orderId: <span className="font-mono text-sm text-blue-600">{request.orderId}</span>,
            paymentMethod: (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                {request.paymentMethod}
              </span>
            ),
            orderStatus: (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {request.orderStatus}
              </span>
            ),
            statusElement: (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : request.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
                }`}
              >
                {requestStatusVN[request.status] || request.status}
              </span>
            ),
            message: (
              <div className="max-w-xs">
                <p className="text-sm text-gray-700 truncate" title={request.message}>
                  {request.message}
                </p>
              </div>
            ),
            createdAt: (
              <span className="text-gray-600">
                {new Date(request.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            ),
          }))}
          columns={[
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

      {/* No Results Message */}
      {filteredRequests.length === 0 && !isLoading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mt-4">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy yêu cầu</h3>
          <p className="text-gray-500">Không có yêu cầu hoàn tiền nào phù hợp với bộ lọc hiện tại.</p>
          <button
            onClick={() => {
              setFilterStatus("all");
              setSearchTerm("");
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Pending Requests Alert */}
      {pendingRequests > 0 && (
        <div className="fixed bottom-4 right-4 bg-orange-100 border border-orange-300 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">Có {pendingRequests} yêu cầu chờ duyệt</p>
              <p className="text-xs text-orange-600">Vui lòng xem xét và xử lý</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRequest;
