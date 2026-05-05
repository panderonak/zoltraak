"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Warehouse } from "@zoltraak/db/schema";
import { buttonVariants } from "@zoltraak/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@zoltraak/ui/components/dropdown-menu";
import { Copy, ExternalLink, MoreVertical } from "lucide-react";

export type WarehouseColumn = Pick<Warehouse, "id" | "name" | "pincode">;

export const columns: ColumnDef<WarehouseColumn>[] = [
	{
		accessorKey: "name",
		header: () => <p className="text-center font-medium">Name</p>,
		cell: ({ row }) => <p className="text-center">{row.original.name}</p>,
	},
	{
		accessorKey: "pincode",
		header: () => <p className="text-center font-medium">Pincode</p>,
		cell: ({ row }) => <p className="text-center">{row.original.pincode}</p>,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const warehouse = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger
						className={buttonVariants({
							variant: "ghost",
							size: "icon-sm",
						})}
					>
						<span className="sr-only">Open menu</span>
						<MoreVertical className="size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>

							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(warehouse.name)}
							>
								<Copy className="size-4" />
								Copy Name
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem>
							<ExternalLink className="size-4" />
							View Details
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
