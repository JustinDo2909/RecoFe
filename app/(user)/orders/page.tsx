"use client";
import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useCreateRefundRequestMutation,
  useLazyGetOrderQuery,
} from "@/state/api";
import { Order } from "@/types";
import { FileX } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";


// Kết nối Socket.IO
const socket = io("http://localhost:9999", { withCredentials: true });

const OrdersPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [getOrder, { data: OrderList }] = useLazyGetOrderQuery({});
  const [createRefunRequest] = useCreateRefundRequestMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    getOrder({});
  }, []);

  useEffect(() => {
    socket.on("orderStatusUpdated", (updatedOrder) => {
      console.log("Received updated order:", updatedOrder); // Log the incoming data

      getOrder({});
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, []);

  const handleRefundOrder = async (order: Order) => {
    const response = await createRefunRequest({
      order: order._id,
      type: "refund",
      message: "Tôi muốn hoàn tiền",
    });
    if (response) {
      getOrder({});
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Container className="py-10">
      {OrderList ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Danh sách đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-auto">Số Đơn Hàng</TableHead>
                    <TableHead className="hidden md:table-cell">Ngày</TableHead>
                    <TableHead>Tổng</TableHead>
                    <TableHead>Trạng thái thanh toán</TableHead>
                    <TableHead>Trạng thái đơn hàng</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Tùy chọn
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <OrdersComponent
                  orders={OrderList}
                  refundOrder={handleRefundOrder}
                />
                <ScrollBar orientation="horizontal" />
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-5 md:py-10 px-4">
          <FileX className="h-24 w-24 text-gray-400 mb-4" />
          <Title>Không có order</Title>
          <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
            It looks like you haven&apos;t placed any orders yet. Start shopping
            to see your orders here!
          </p>
          <Button asChild className="mt-6">
            <Link href={"/"}>Browse Products</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default OrdersPage;
