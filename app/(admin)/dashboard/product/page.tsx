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
          { key: "_id", label: "ID" , type: "text"},
          { key: "name", label: "Product Name",  type: "text"},
          { key: "decription", label: "Decription" , type: "text"},
          { key: "price", label: "Price" , type: "number"},
          { key: "picture", label: "Picture" , type: "image"},
          { key: "stock", label: "Stock" , type: "number"},
          { key: "categorys", label: "Categorys", type: "text"},
          { key: "createdAt", label: "Date Created", type: "date"},
          { key: "updatedAt", label: "Date Updated", type: "date"},
        ]}
        onCreate={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    </div>
  );
};

export default DashboardProduct;
