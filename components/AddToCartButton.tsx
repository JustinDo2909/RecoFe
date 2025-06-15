import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import QuantityButtons from "./QuantityButtons";
import PriceFormatter from "./PriceFormatter";
import { useAddProductToCardMutation, useGetCardQuery } from "@/state/api";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

interface Props {
  product: any;
  className?: string;
  quantity? : number
}

const AddToCartButton = ({ product, className, quantity }: Props) => {
  const [addProduct] = useAddProductToCardMutation();
  const { data: cartList, refetch } = useGetCardQuery();
  const [itemCount, setItemCount] = useState(0);
  const router = useRouter();
  const {user} = useUser()
  useEffect(() => {
    const item = cartList?.find((item) => item?.productId?._id === product._id);
    setItemCount(item?.quantity ?? 0);
  }, [cartList, product._id]); // Re-sync item count when cartList changes

  const isOutOfStock = product?.stock === 0;

const handleAdd = async () => {
  if (user) {
    const result = await addProduct({
      productId: product._id || "",
      quantity: 1,
    });
    toast.success(`${product.name?.substring(0, 12)} ${result.data?.message}`);
    await refetch();
  } else {
    router.push("/login");
    toast.error("Vui lòng đăng nhập");
  }
};
console.log('quantity', quantity)
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
              setItemCount={setItemCount} // Pass the setItemCount function down to update itemCount
            />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Giá sản phẩm</span>
            <PriceFormatter amount={product.finalPrice * itemCount} />
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
          Thêm vào giỏ hàng
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
