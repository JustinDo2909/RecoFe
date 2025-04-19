"use client";
import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import { useGetAllOrderQuery } from "@/state/api";
import { Order } from "@/types";
import React, { useEffect, useState } from "react";

const DashboardOrder = () => {
  const { data: orders, isLoading } = useGetAllOrderQuery({});
  const [OrderList, setOrderList] = React.useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (orders) {
      setOrderList(orders as Order[]);
    }
  }, [orders]);
  if (!isMounted) {
    return null;
  }
  return (
    <div>
        {isLoading && <div><Loading/></div>}
      <CustomTable
        ITEMS_PER_PAGE={10}
        data={OrderList}
        columns={[
          { key: "_id", label: "ID" },
          { key: "userId", label: "User ID" },
          { key: "totalPrice", label: "Price" },
          { key: "paymentMethod", label: "PaymentMethod" },
          { key: "statusOrder", label: "Status Order" },
          { key: "statusPayment", label: "Status Payment" },
          { key: "createdAt", label: "Date Created" },
        ]}
        onCreate={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    </div>
  );
};

export default DashboardOrder;
