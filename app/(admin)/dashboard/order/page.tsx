"use client";

import Loading from "@/components/Loading";
import OrderTable from "@/components/OrderTable";
import { useGetAllOrderQuery, useGetUsersQuery, useUpdateOrderStatusMutation } from "@/state/api";
import type { Order, User } from "@/types";
import { CheckCircle, Clock, Filter, Search, ShoppingBag, Truck, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

// const statusColorMap: Record<string, string> = {
//   Processing: "text-yellow-500",
//   Shipping: "text-blue-500",
//   Done: "text-green-500",
//   Cancel: "text-red-500",
//   "Refund Approved": "text-purple-500",
//   "Refund Requested": "text-orange-500",
//   "Refund Rejected": "text-gray-500",
// };

const statusPaymentViMap: Record<string, string> = {
  Paid: "Đã thanh toán",
  Failed: "Thanh toán thất bại",
  Pending: "Đang thanh toán",
};

// const statusPaymentColorMap: Record<string, string> = {
//   Paid: "text-green-600",
//   Failed: "text-red-600",
//   Pending: "text-yellow-600",
// };

type FilterStatus = "all" | "Processing" | "Shipping" | "Done" | "Cancel" | "Refund Requested";
type FilterPayment = "all" | "Paid" | "Failed" | "Pending";

const formatPriceVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const DashboardOrder = () => {
  const { data: orders, isLoading, refetch } = useGetAllOrderQuery();
  const { data: users } = useGetUsersQuery({});
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPayment, setFilterPayment] = useState<FilterPayment>("all");

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (orders) {
      // Reverse the list to show newest first
      const reversedOrders = [...(orders as Order[])].reverse();
      setOrderList(reversedOrders);
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

  // Filter orders based on search term and filters
  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      // Filter by status
      const statusMatch = filterStatus === "all" || order.statusOrder === filterStatus;

      // Filter by payment status
      const paymentMatch = filterPayment === "all" || order.statusPayment === filterPayment;

      // Filter by search term
      const searchMatch =
        searchTerm === "" ||
        usersMap[order.userId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && paymentMatch && searchMatch;
    });
  }, [orderList, filterStatus, filterPayment, searchTerm, usersMap]);

  // Calculate statistics
  const totalOrders = orderList.length;
  const processingOrders = orderList.filter((o) => o.statusOrder === "Processing").length;
  const shippingOrders = orderList.filter((o) => o.statusOrder === "Shipping").length;
  const doneOrders = orderList.filter((o) => o.statusOrder === "Done").length;
  const cancelOrders = orderList.filter((o) => o.statusOrder === "Cancel").length;
  const filteredCount = filteredOrders.length;

  console.log("orderList", orderList);
  console.log(
    "filtered",
    orderList.filter(
      (o) => o.statusOrder?.toLowerCase().trim() === "done" && o.statusPayment?.toLowerCase().trim() === "paid"
    )
  );

  // Calculate total revenue
  const totalRevenue = orderList
    .filter((o) => o.statusOrder?.toLowerCase().trim() === "done" && o.statusPayment?.toLowerCase().trim() === "paid")
    .reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);

  if (!isMounted) {
    return null;
  }

  const handleUpdateStatus = async (id: string, status: string, reason?: string) => {
    try {
      const result = await updateOrderStatus({
        id,
        statusOrder: status,
        reason,
      }).unwrap();
      setOrderList((prev) => prev.map((order) => (order._id === id ? { ...order, statusOrder: status } : order)));
      toast.success(result.message);
      refetch();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="w-full min-h-screen">
      {isLoading && <Loading />}

      {/* Statistics and Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-6 w-full">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6 w-full">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
                <div className="text-sm text-blue-600">Tổng đơn hàng</div>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{processingOrders}</div>
                <div className="text-sm text-yellow-600">Đang xử lý</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{shippingOrders}</div>
                <div className="text-sm text-blue-600">Đang giao</div>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{doneOrders}</div>
                <div className="text-sm text-green-600">Hoàn thành</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{cancelOrders}</div>
                <div className="text-sm text-red-600">Đã hủy</div>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-purple-600">{formatPriceVND(totalRevenue)}</div>
                <div className="text-sm text-purple-600">Doanh thu</div>
              </div>
              <ShoppingBag className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
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
                <option value="Processing">Đang xử lý</option>
                <option value="Shipping">Đang giao hàng</option>
                <option value="Done">Hoàn thành</option>
                <option value="Cancel">Đã hủy</option>
                <option value="Refund Requested">Yêu cầu hoàn tiền</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value as FilterPayment)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả thanh toán</option>
                <option value="Paid">Đã thanh toán</option>
                <option value="Pending">Đang thanh toán</option>
                <option value="Failed">Thanh toán thất bại</option>
              </select>
            </div>
          </div>

          {/* Current filter info */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {searchTerm === "" && filterStatus === "all" && filterPayment === "all"
              ? `Hiển thị tất cả ${totalOrders} đơn hàng`
              : `Tìm thấy ${filteredCount} kết quả`}
          </div>
        </div>
      </div>

      {/* Order Table */}
      <div className="w-full overflow-x-auto">
        <OrderTable
          ITEMS_PER_PAGE={10}
          data={filteredOrders}
          columns={[
            {
              key: "userId",
              label: "Tên người dùng",
              render: (userId: any) => <span className="font-medium text-gray-900">{usersMap[userId] || userId}</span>,
            },
            {
              key: "totalPrice",
              label: "Giá",
              render: (value: any) => <span className="font-semibold text-green-600">{formatPriceVND(value)}</span>,
            },
            {
              key: "paymentMethod",
              label: "Phương thức thanh toán",
              render: (value: any) => (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">{value}</span>
              ),
            },
            {
              key: "statusPayment",
              label: "Trạng thái thanh toán",
              render: (value: any) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === "Paid"
                      ? "bg-green-100 text-green-800"
                      : value === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {statusPaymentViMap[value] || value}
                </span>
              ),
            },
            {
              key: "statusOrder",
              label: "Trạng thái đơn hàng",
              render: (value: any) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === "Done"
                      ? "bg-green-100 text-green-800"
                      : value === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : value === "Shipping"
                          ? "bg-blue-100 text-blue-800"
                          : value === "Cancel"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusOrderViMap[value] || value}
                </span>
              ),
            },
            {
              key: "createdAt",
              label: "Ngày tạo",
              render: (value: any) => <span className="text-gray-600">{formatDate(value)}</span>,
            },
          ]}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {/* No Results Message */}
      {filteredOrders.length === 0 && !isLoading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mt-4">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy đơn hàng</h3>
          <p className="text-gray-500">Không có đơn hàng nào phù hợp với bộ lọc hiện tại.</p>
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterPayment("all");
              setSearchTerm("");
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardOrder;
