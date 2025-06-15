"use client";
import LogoReco from "@/components/LogoReco";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  Bell,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Package,
  Package2Icon,
  PanelLeft,
  ServerIcon,
  User,
  TicketPercent,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

const AppSidebar = () => {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { logout, user } = useUser();

  const navLinks = {
    admin: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/overview" },
      { icon: User, label: "Người dùng", href: "/dashboard/user" },
      { icon: BookOpen, label: "Loại", href: "/dashboard/category" },
      { icon: Package, label: "Đơn hàng", href: "/dashboard/order" },
      { icon: Package2Icon, label: "Sản phẩm", href: "/dashboard/product" },
      { icon: ServerIcon, label: "Dịch vụ", href: "/dashboard/service" },
      { icon: Bell, label: "Yêu cầu", href: "/dashboard/request" },
      { icon: TicketPercent, label: "Giảm giá", href: "/dashboard/discount" },
    ],
  };

  const handleLogout = async () => {
    await logout();
    redirect("/login");
  };
  // if (!loading) return <Loading />;
  if (!user) return <div>User not found</div>;

  const userType: "admin" = user?.user.role;
  const currentNavLinks = navLinks[userType];
  return (
    <Sidebar collapsible="icon" style={{ height: "100vh" }} className="bg-white border-none shadow-lg">
      <SidebarHeader>
        <SidebarMenu className="mt-5 group-data-[collapsible=icon]:mt-7">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => toggleSidebar()}
              className="group hover:bg-customgreys-secondarybg"
            >
              <div className="flex justify-between items-center gap-5 pl-3 pr-1 h-10 w-full group-data-[collapsible=icon]:ml-1 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:px-0">
                <div className="flex items-center gap-5">
                  <LogoReco className="transition duration-200 group-data-[collapsible=icon]:group-hover:brightness-75 w-auto" />

                  <p className="text-lg font-extrabold group-data-[collapsible=icon]:hidden">RECO</p>
                </div>
                <PanelLeft className="text-gray-400 w-5 h-5 group-data-[collapsible=icon]:hidden" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="mt-7 gap-0">
          {currentNavLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <SidebarMenuItem
                key={link.href}
                className={cn(
                  "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-4 hover:bg-customgreys-secondarybg",
                  isActive && "bg-gray-800 text-white"
                )}
              >
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className={cn(
                    "gap-4 p-8 hover:bg-customgreys-secondarybg group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center",
                    !isActive && "text-customgreys-dirtyGrey"
                  )}
                >
                  <Link href={link.href} className="relative flex items-center" scroll={false}>
                    <link.icon className={isActive ? "text-white-50" : "text-gray-500"} />
                    <span
                      className={cn(
                        "font-medium text-md ml-4 group-data-[collapsible=icon]:hidden",
                        isActive ? "text-white-50" : "text-gray-500"
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className="absolute right-0 top-0 h-full w-[4px] bg-primary-750" />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={handleLogout} className="text-primary-700 pl-8">
                <LogOut className="mr-2 h-6 w-6" />
                <span>Đăng xuất</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
