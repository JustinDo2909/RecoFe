"use client"
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ProductGrid from "@/components/ProductGrid";
import { getProductBySlug } from "@/sanity/helpers/queries";
import { useGetProductQuery } from "@/state/api";
import {
  BoxIcon,
  FileQuestion,
  Heart,
  ListOrderedIcon,
  Share,
} from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const Products = () => {
  const {
      data: product,
      isLoading: isLoading,
      isError: isError,
    } = useGetProductQuery({});
  return (
    <Container className="py-10 flex flex-col md:flex-row gap-10">
      <ProductGrid products={product}/>
    </Container>
  );
};

export default Products;
