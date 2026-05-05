"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@zoltraak/ui/components/sidebar";
import { Skeleton } from "@zoltraak/ui/components/skeleton";
import {
  Blocks,
  BoxIcon,
  ChartLine,
  FlowerIcon,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import { redirect } from "next/navigation";
import type * as React from "react";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { useSession } from "@/lib/auth-client";

const data = {
  navMain: [
    {
      name: "Dashboard",
      url: "#",
      icon: <ChartLine />,
    },
    {
      name: "Products",
      url: "#",
      icon: <BoxIcon />,
    },
    {
      name: "Warehouses",
      url: "#",
      icon: <Warehouse />,
    },
    {
      name: "Delivery Persons",
      url: "#",
      icon: <Users />,
    },
    {
      name: "Orders",
      url: "#",
      icon: <ShoppingCart />,
    },
    {
      name: "Inventories",
      url: "#",
      icon: <Blocks />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    // TODO: Improve this
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return redirect("/sign-in");
  }

  const { user } = session;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <FlowerIcon className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Zoltraak Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
