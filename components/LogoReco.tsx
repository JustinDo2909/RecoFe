import React from "react";
import logo from "@/images/Logo.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}
const LogoReco = ({ className }: Props) => {
  return (
    <div className={cn(``, className)}>
      <Image src={logo} width={100} height={100} alt="logo" />
    </div>
  );
};

export default LogoReco;
