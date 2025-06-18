import Image from "next/image";
import Link from "next/link";
import React from "react";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/types";

const ProductCard = ({
  product,
  hideButton,
}: {
  product: Product;
  hideButton?: boolean;
}) => {
  return (
    <div className="group text-sm rounded-lg overflow-hidden max-h-[350px] flex flex-col border border-zinc-200 bg-zinc-50">
      <div className="relative overflow-hidden">
        {product?.picture && (
          <Link href={`/product/${product?._id}`}>
            <Image
              src={product?.picture}
              width={500}
              height={500}
              alt="productImage"
              priority
              className={`w-full h-[200px] object-cover hoverEffect ${product?.stock !== 0 && "group-hover:scale-105"}`}
            />
          </Link>
        )}
        {product?.stock === 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-darkColor/50 flex items-center justify-center">
            <p className="text-xl text-white font-semibold text-center">
              Out of Stock
            </p>
          </div>
        )}
      </div>
      <div className="py-3 px-2 flex flex-col gap-1.5 flex-1 overflow-hidden">
        <h2 className="font-semibold line-clamp-1">{product?.name}</h2>
        <p className="line-clamp-2 text-ellipsis">{product?.description}</p>
        <PriceView className="text-lg" price={product?.price} discount={20} />
        {!hideButton && <AddToCartButton product={product} />}
      </div>
    </div>
  );
};

export default ProductCard;
