"use client";
import { Product } from "@/types";
import { AnimatePresence, motion } from "framer-motion"; // Sửa từ "motion/react" thành "framer-motion"
import React, { useState } from "react";
import HomeTabbar from "./HomeTabbar";
import NoProductsAvailable from "./NoProductsAvailable";
import ProductCard from "./ProductCard";

interface ProductSlideProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductSlideProps> = ({ products }) => {
  const [selectedTab, setSelectedTab] = useState("");

  const filteredProducts = selectedTab
    ? products.filter(
        (product) =>
          product.isActive === true &&
          product.stock !== 0 &&
          product.categories?.some((cat) => {
            console.log("cat._id:", cat, "| selectedTab:", selectedTab);
            return cat === selectedTab;
          }),
      )
    : products.filter(
        (product) => product.isActive === true && product.stock !== 0,
      );

  const handleReset = () => {
    setSelectedTab("");
  };

  return (
    <div className="mt-10 flex flex-col items-center">
      <HomeTabbar
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
        onReset={handleReset}
      />
      <>
        {filteredProducts?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 w-full ">
            {filteredProducts?.map((product: Product) => (
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
