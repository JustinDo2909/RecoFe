"use client";

import { useGetProductByIdQuery } from "@/state/api";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Import StickerEditor với ssr: false để chỉ render trên client
const StickerEditor = dynamic(() => import("@/app/(user)/customeBag/customeBag"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải Sticker Editor...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  // const params = useParams();
  // const id = params.id;
  const id = "684a85aa1d6c9de849557543";

  const { data: product } = useGetProductByIdQuery({ id });

  return (
    <main>
      <StickerEditor product={product} />
    </main>
  );
}
