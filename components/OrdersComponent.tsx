"use client";
import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { format } from "date-fns";
import PriceFormatter from "./PriceFormatter";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { Order } from "@/types";
import { useUser } from "@/hooks/useUser";

interface Props {
  orders: Order[];
  refundOrder?: (order: Order) => void;
}

const OrdersComponent = ({
  orders,
  refundOrder,
}: {
  orders: Props["orders"];
  refundOrder: Props["refundOrder"];
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useUser();
  console.log("user", user);

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleRefundClick = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation(); // Ngăn sự kiện lan ra row
    refundOrder?.(order);
  };

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders?.map((order: any) => (
            <Tooltip key={order?._id}>
              <TooltipTrigger asChild>
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 h-12"
                  onClick={() => handleRowClick(order)}
                >
                  <TableCell className="font-medium">
                    {order._id?.slice(-10) ?? "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order?.createdAt &&
                      format(new Date(order.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  {/* <TableCell>{user?.username}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user?.email}
                  </TableCell> */}
                  <TableCell>
                    <PriceFormatter
                      amount={order?.totalPrice}
                      className="text-black font-medium"
                    />
                  </TableCell>
                  <TableCell>
                    {order?.statusPayment && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order?.statusPayment === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order?.statusPayment === "Paid"
                          ? "Đã thanh toán"
                          : "Thanh toán lúc nhận hàng"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {(() => {
                        switch (order?.statusOrder) {
                          case "Processing":
                            return "Đang xử lý";
                          case "Shipping":
                            return "Đang giao hàng";
                          case "Done":
                            return "Hoàn thành";
                          case "Refund Approved":
                            return "Đã chấp nhận hoàn tiền";
                          case "Cancel":
                            return "Đã hủy";
                          case "Refund Requested":
                            return "Yêu cầu hoàn tiền";
                          case "Refund Rejected":
                            return "Từ chối hoàn tiền";
                          default:
                            return "Không xác định";
                        }
                      })()}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {refundOrder && order?.statusOrder === "Processing" && (
                      <button
                        onClick={(e) => handleRefundClick(e, order)}
                        className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                      >
                        Gửi yêu cầu hoàn tiền
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>Nhấn vào để xem chi tiết</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>
      <OrderDetailsDialog
        user={user}
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;
