"use client";
import React from "react";
import HeaderMenu from "./HeaderMenu";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import Link from "next/link";
import Cookies from "js-cookie";
import { useUser } from "@/hooks/useUser";
import { headerData } from "@/constants";
import LogoReco from "./LogoReco";
const Header = () => {
  const { logout } = useUser();
  const token = Cookies.get("authToken");

  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className="border-b border-b-gray-400 py-5 sticky top-0 z-50 bg-white">
      <Container className="flex items-center justify-between gap-7 text-lightColor">
      <LogoReco className="hidden md:block"/>
       <HeaderMenu headers={headerData} />

        <div className="w-auto md:w-1/3 flex items-center justify-center gap-2.5 md:hidden">
          <MobileMenu />
        </div>
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />

          {!token ? (
            <Link href={"/login"}>Login</Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
