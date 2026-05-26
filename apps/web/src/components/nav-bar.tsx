"use client";

import type { User } from "@zoltraak/auth";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zoltraak/ui/components/avatar";
import { Button } from "@zoltraak/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zoltraak/ui/components/dropdown-menu";
import { FlowerIcon, LogOutIcon, UserCheck2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cart } from "@/components/cart";
import { signOut } from "@/lib/auth-client";

interface NavBarProps {
	user: User;
}

export function NavBar({ user }: NavBarProps) {
	const router = useRouter();
	const IS_ADMIN = user.role === "admin";
	const dashboardPath = IS_ADMIN ? "/admin/products" : "/become-seller";
	return (
		<header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
				<Link className="flex items-center gap-2" href={"/products"}>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<FlowerIcon className="size-5" />
					</div>
					<span className="font-bold text-xl">Zoltraak</span>
				</Link>

				<div className="flex gap-x-3">
					<Cart />
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									size="icon-lg"
									variant="outline"
									className="aria-expanded:bg-muted"
								/>
							}
						>
							<Avatar>
								{user.image && <AvatarImage src={user.image} alt={user.name} />}
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="min-w-56 rounded-lg"
							align="end"
							sideOffset={4}
						>
							<DropdownMenuGroup>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar>
											{user.image && (
												<AvatarImage src={user.image} alt={user.name} />
											)}
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">{user.name}</span>
											<span className="truncate text-xs">{user.email}</span>
										</div>
									</div>
								</DropdownMenuLabel>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => router.push(dashboardPath)}>
									<UserCheck2Icon />
									{IS_ADMIN ? "Admin Dashboard" : "Become Seller"}
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									signOut({
										fetchOptions: {
											onSuccess: () => {
												router.push("/sign-in");
											},
										},
									});
								}}
							>
								<LogOutIcon />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
