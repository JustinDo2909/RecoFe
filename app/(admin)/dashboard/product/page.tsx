"use client";
import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import { useGetProductQuery } from "@/state/api";
import { Product } from "@/types";
import React, { useEffect, useState } from "react";

const DashboardProduct = () => {
  const { data: Products, isLoading } = useGetProductQuery({});
  const [ProductList, setProductList] = React.useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (Products) {
      setProductList(Products as Product[]);
    }
  }, [Products]);
  if (!isMounted) {
    return null;
  }
  return (
    <div>
        {isLoading && <div><Loading/></div>}
      <CustomTable
        ITEMS_PER_PAGE={10}
        data={ProductList}
        columns={[
          { key: "_id", label: "ID" },
          { key: "name", label: "Product Name" },
          { key: "decription", label: "Decription" },
          { key: "price", label: "Price" },
          { key: "picture", label: "Picture" },
          { key: "stock", label: "Stock" },
          { key: "categorys", label: "Categorys" },
          { key: "createdAt", label: "Date Created" },
          { key: "updatedAt", label: "Date Updated" },
        ]}
        onCreate={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    </div>
  );
};

export default DashboardProduct;
