"use client";

import { useDeleteAllProductToCardMutation } from "@/state/api";
import { useRouter } from "next/navigation"; // ✅ dùng đúng module
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [deleteAllCart] = useDeleteAllProductToCardMutation();

  useEffect(() => {
    const clearCart = async () => {
      try {
        await deleteAllCart({}).unwrap();
        toast.success("Thanh toán thành công! Giỏ hàng đã được xoá.");
        router.push("/"); // chuyển hướng sau khi xoá
      } catch (error) {
        console.error("Xoá giỏ hàng lỗi:", error);
        toast.error("Không thể xoá giỏ hàng.");
      }
    };

    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-xl text-green-600 font-semibold">Đang xử lý đơn hàng...</h1>
    </div>
  );
}
