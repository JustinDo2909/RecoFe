"use client";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
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
  console.log(orders, "fff");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useUser();
  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders?.map((order: any) => (
            <Tooltip key={order?._id}>
              <TooltipTrigger asChild>
                <TableRow
                  className=" cursor-pointer hover:bg-gray-100 h-12"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="font-medium">
                    {order._id?.slice(-10) ?? "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order?.createdAt &&
                      format(new Date(order.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{user?.Finduser.username}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user?.Finduser.email}
                  </TableCell>
                  <TableCell>
                    <PriceFormatter
                      amount={order?.totalPrice}
                      className="text-black font-medium"
                    />
                  </TableCell>
                  <TableCell>
                    {order?.status && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${order?.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {order?.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {refundOrder && (
                      <button
                        onClick={() => refundOrder(order)}
                        className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800"
                      >
                        Send Refund Request
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>Click to see order details</TooltipContent>
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
