"use client";
import Container from "@/components/Container";

import ProductGrid from "@/components/ProductGrid";
import { SelectFiled } from "@/components/SelectFiled";

import { useGetProductQuery } from "@/state/api";
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from "@/state/apiGHN";

import React from "react";

const Products = () => {

  const { data: product } = useGetProductQuery({});
  return (
    <Container className="py-10 flex flex-col md:flex-row gap-10">
      <ProductGrid products={product || []} />
     
    </Container>
  );
};

export default Products;
