"use client";

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@zoltraak/ui/components/sidebar";
import type { Route } from "next";
import Link from "next/link";

export function NavProjects({
	projects,
}: {
	projects: {
		name: string;
		url: Route;
		icon: React.ReactNode;
	}[];
}) {
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton render={<Link href={item.url} />}>
							{item.icon}
							<span>{item.name}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
