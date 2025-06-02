import Providers from "@/app/providers";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";

export const metadata: Metadata = {
  title: "Reco Ecommerce app for shoppers",
  description: "An Ecommerce app for education purposes",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Providers>{children}</Providers>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#ffffff",
          },
        }}
      />
    </SidebarProvider>
  );
}
