"use client";
import { useLazyGetOrderQuery } from "@/state/api";
import { ListOrderedIcon } from "lucide-react";

import Link from "next/link";
import { useEffect } from "react";

const OrderIcon = () => {
  const [order, { data: items }] = useLazyGetOrderQuery({});
  useEffect(() => {
    order({});
  }, [items]);
  return (
    <Link href={"/orders"} className="group relative">
      <ListOrderedIcon className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
      <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
        {items?.length ? items.length : 0}
      </span>
    </Link>
  );
};

export default OrderIcon;
