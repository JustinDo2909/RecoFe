"use client";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

interface Header {
  title: string;
  href: string;
}

interface HeaderMenuProps {
  headers: Header[];
}

const HeaderMenu = ({ headers }: HeaderMenuProps) => {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex w-full items-center text-center gap-5 md:text-sm  lg:text-lg capitalize font-semibold">
      {headers.map((header, index) => (
        <Link
          key={index}
          href={header.href}
          className={`hover:text-darkColor hoverEffect   relative group ${
            pathname === header.href && "text-darkColor"
          }`}
        >
          {header.title}
          <span
            className={`absolute -bottom-0.5 left-1/2  w-0 h-0.5 bg-darkColor hoverEffect group-hover:w-1/2 group-hover:left-5 ${
              pathname === header.href && "w-1/2"
            }`}
          />
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-darkColor hoverEffect group-hover:w-1/2 group-hover:right-5 ${
              pathname === header.href && "w-1/2"
            }`}
          />
        </Link>
      ))}
      <Button
        onClick={() => redirect("/chatbot")}
        className="text-lg px-2 p-5 text-white font-normal  bg-black  rounded-full hoverEffect"
      >
        AI Style
      </Button>
    </div>
  );
};

export default HeaderMenu;
