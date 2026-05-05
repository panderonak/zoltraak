"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { DeliveryPerson, Warehouse } from "@zoltraak/db/schema";
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

export type DeliveryPersonColumn = Pick<DeliveryPerson, "name" | "phone"> & {
	warehouse: Pick<Warehouse, "name">;
};

export const columns: ColumnDef<DeliveryPersonColumn>[] = [
	{
		accessorKey: "name",
		header: () => <p className="text-center font-medium">Name</p>,
		cell: ({ row }) => <p className="text-center">{row.original.name}</p>,
	},
	{
		accessorKey: "warehouse",
		header: () => <p className="text-center font-medium">Warehouse</p>,
		cell: ({ row }) => (
			<p className="text-center">{row.original.warehouse.name}</p>
		),
	},
	{
		accessorKey: "phone",
		header: () => <p className="text-center font-medium">Phone</p>,
		cell: ({ row }) => <p className="text-center">{row.original.phone}</p>,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const person = row.original;

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
								onClick={() => navigator.clipboard.writeText(person.phone)}
							>
								<Copy className="size-4" />
								Copy Phone
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
