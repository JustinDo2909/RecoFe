"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import { Input } from "./ui/input";
import { categoriesData, quickLinksData } from "@/constants";
import Link from "next/link";
import LogoReco from "./LogoReco";

const Footer = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <footer className="bg-[#A0BBA7] border-t">
      <Container>
        {/* <FooterTop /> */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <LogoReco className="justify-center flex md:justify-start" />
            <p className="text-gray-600 text-sm  pb-4">
              Mỗi sản phẩm của RECO đều được thiết kế lại, từ những chiếc áo cũ,
              túi xách đã qua sử dụng đến các phụ kiện, tất cả đều được biến hóa
              để mang lại sự tươi mới và độc đáo.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-darkColor mb-4">RECO</h3>
            <div className="flex flex-col gap-3">
              {quickLinksData?.map((item) => (
                <Link
                  key={item?.title}
                  href={item?.href}
                  className="text-gray-600 hover:text-darkColor text-sm font-medium hoverEffect"
                >
                  {item?.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-darkColor mb-4">Trợ Giúp</h3>
            <div className="flex flex-col gap-3">
              {categoriesData?.map((item) => (
                <Link
                  key={item?.title}
                  href={`https://reco-fe.vercel.app/${item?.href}`}
                  className="text-gray-600 hover:text-darkColor text-sm font-medium hoverEffect"
                >
                  {item?.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-darkColor mb-4">Tham Gia Ngay</h3>
            <p className="text-gray-600 text-sm mb-4">
              Trở thành thành viên của RECO để được tích điểm & nhận ưu đãi cho
              lần mua hàng tiếp theo!
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Nhập Email của bạn"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button
                type="submit"
                className="w-full bg-darkColor text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Đăng Ký Ngay
              </button>
            </form>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
