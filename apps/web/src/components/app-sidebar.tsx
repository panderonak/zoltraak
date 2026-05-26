"use client";

import type { Session } from "@zoltraak/auth";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@zoltraak/ui/components/sidebar";
import {
	Blocks,
	BoxIcon,
	FlowerIcon,
	ShoppingCart,
	Users,
	Warehouse,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type * as React from "react";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { useSession } from "@/lib/auth-client";

const NAV_ITEMS: {
	name: string;
	url: Route;
	icon: React.ReactNode;
}[] = [
	{ name: "Products", url: "/admin/products", icon: <BoxIcon /> },
	{ name: "Warehouses", url: "/admin/warehouses", icon: <Warehouse /> },
	{ name: "Delivery Persons", url: "/admin/delivery-persons", icon: <Users /> },
	{ name: "Orders", url: "/admin/orders", icon: <ShoppingCart /> },
	{ name: "Inventories", url: "/admin/inventories", icon: <Blocks /> },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	initialSession: Session;
}

export function AppSidebar({ initialSession, ...props }: AppSidebarProps) {
	const { data: session } = useSession();
	const user = session?.user ?? initialSession.user;

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" render={<Link href="/products" />}>
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
				<NavProjects projects={NAV_ITEMS} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
