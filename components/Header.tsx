"use client";
import { headerData } from "@/constants";
import { useUser } from "@/hooks/useUser";
import Cookies from "js-cookie";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartIcon from "./CartIcon";
import Container from "./Container";
import HeaderMenu from "./HeaderMenu";
import LogoReco from "./LogoReco";
import MobileMenu from "./MobileMenu";
import OrderIcon from "./OrderIcon";
import SearchBar from "./SearchBar";

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { logout } = useUser();
  const token = Cookies.get("authToken");
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    redirect("/login");
  };

  if (!isMounted) {
    return null;
  }
  return (
    <header className="border-b border-b-gray-400 py-5 sticky top-0 z-50 bg-white">
      <Container className="flex items-center justify-between gap-7 text-lightColor">
        <LogoReco className="hidden md:block" />
        <HeaderMenu headers={headerData} />

        <div className="w-auto md:w-1/3 flex items-center justify-center gap-2.5 md:hidden">
          <MobileMenu />
        </div>
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          {/* <SearchBar /> */}

          {!token ? (
            <Link href={"/login"}>Login</Link>
          ) : (
            <>
              <CartIcon />
              <OrderIcon />
              <div className="flex gap-1">
                <UserIcon
                  className="cursor-pointer"
                  onClick={() => router.push("/profile")}
                />
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
