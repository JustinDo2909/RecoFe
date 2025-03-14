"use client";
import React, { useState } from "react";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants";
import ProductCard from "./ProductCard";
import NoProductsAvailable from "./NoProductsAvailable";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "@/types";

interface ProductSlideProps {
  products: Product[];
}
const ProductGrid : React.FC<ProductSlideProps> = ({ products }) => {
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  return (
    <div className="mt-10 flex flex-col items-center">
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
        <>
          {products?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full">
              {products?.map((product: Product) => (
                <AnimatePresence key={product?._id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          ) : (
            <NoProductsAvailable selectedTab={selectedTab} />
          )}
        </>
    </div>
  );
};

export default ProductGrid;
