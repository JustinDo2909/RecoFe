"use client";
import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import { useGetCategoryQuery } from "@/state/api";
import { Category } from "@/types";
import React, { useEffect, useState } from "react";

const DashboardCategory = () => {
  const { data: categorys, isLoading } = useGetCategoryQuery({});
  const [categoryList, setCategoryList] = React.useState<Category[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (categorys) {
      setCategoryList(categorys as Category[]);
    }
  }, [categorys]);
  if (!isMounted) {
    return null;
  }
  return (
    <div>
        {isLoading && <div><Loading/></div>}
      <CustomTable
        ITEMS_PER_PAGE={10}
        data={categoryList}
        columns={[
          { key: "_id", label: "ID" },
          { key: "title", label: "Title" },
          { key: "decription", label: "Decription" },
          { key: "products", label: "Products" },
        ]}
        onCreate={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    </div>
  );
};

export default DashboardCategory;
