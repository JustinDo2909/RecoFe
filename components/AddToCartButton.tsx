
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import QuantityButtons from "./QuantityButtons";
import PriceFormatter from "./PriceFormatter";
import { Product } from "@/types";
import { useAddProductToCardMutation, useGetCardQuery } from "@/state/api";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const [addProduct] = useAddProductToCardMutation();
  const { data: cartList, refetch } = useGetCardQuery({});
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const item = cartList?.find((item) => item.productId?._id === product._id);
    setItemCount(item?.quantity ?? 0);
  }, [cartList, product._id]); // Re-sync item count when cartList changes

  const isOutOfStock = product?.stock === 0;

  const handleAdd = async () => {
    await addProduct({
      productId: product._id,
      quantity: 1,
    });
    toast.success(`${product.name?.substring(0, 12)}... added successfully!`);
    await refetch();
  };

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount > 0 ? (
        <div className="w-full text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Quantity</span>
            <QuantityButtons
              product={product}
              cartList={cartList || []}
              refetch={refetch}
              setItemCount={setItemCount}  // Pass the setItemCount function down to update itemCount
            />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter amount={product.price * itemCount} />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-transparent text-darkColor shadow-none border border-darkColor/30 font-semibold tracking-wide hover:text-white hoverEffect",
            className
          )}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
