import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Card, Product } from "@/types";
import {
  useAddProductToCardMutation,
  useUpdateProductToCardMutation,
} from "@/state/api";
import { set } from "sanity";

interface Props {
  product: Product;
  className?: string;
  cartList: Card[];
  refetch: () => void;
  setItemCount: React.Dispatch<React.SetStateAction<number>>; 
}

const QuantityButtons = ({ product, className, cartList, refetch, setItemCount }: Props) => {
  const [updateQuantityProduct] = useUpdateProductToCardMutation();
  const [itemCount, setItemCountLocal] = useState(0);
  useEffect(() => {
    const productInCart = cartList.find((item) => item.productId?._id === product._id);
    if (productInCart) {
      setItemCount(productInCart.quantity); 
      setItemCountLocal(productInCart.quantity);
    } else {
      setItemCount(0); 
    }
  }, [cartList, product._id, setItemCount]); 

  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = async () => {
    setItemCount((prevCount) => Math.max(prevCount - 1, 0)); 
    await updateQuantityProduct({
      productId: product?._id,
      quantity: 1,
      action: "decrease",
    });
    toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    refetch();
  };

  const handleAddProduct = async () => {
    setItemCount((prevCount) => prevCount + 1); 
    await updateQuantityProduct({
      productId: product?._id,
      quantity: 1,
      action: "increase",
    });
    toast.success(`${product?.name?.substring(0, 12)} added successfully!`);
    refetch();
  };

  return (
    <div className={cn("flex items-center gap-1 text-base pb-1", className)}>
      <Button
        onClick={handleRemoveProduct}
        disabled={itemCount === 0 || isOutOfStock}
        variant="outline"
        size="icon"
        className="w-6 h-6"
      >
        <Minus />
      </Button>
      <span className="font-semibold w-8 text-center text-darkColor">
        {itemCount}
      </span>
      <Button
        onClick={handleAddProduct}
        variant="outline"
        size="icon"
        className="w-6 h-6"
      >
        <Plus />
      </Button>
    </div>
  );
};


export default QuantityButtons;
