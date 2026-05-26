"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import type { DeliveryPerson, Warehouse } from "@zoltraak/db/schema";
import { Badge } from "@zoltraak/ui/components/badge";
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
import {
	CheckCircle,
	Copy,
	ExternalLink,
	MoreVertical,
	PowerOff,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteDeliveryPerson, updateDeliveryPerson } from "@/http/api";
import { cn } from "@/lib/utils";

export type DeliveryPersonColumn = Pick<
	DeliveryPerson,
	"id" | "name" | "phone" | "status"
> & {
	warehouse: Pick<Warehouse, "name">;
};

const deliveryPersonStatusStyles: Record<string, string> = {
	available:
		"bg-green-50  text-green-700  dark:bg-green-950  dark:text-green-300",
	busy: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
	offline: "bg-secondary text-secondary-foreground",
};

function ActionsCell({ person }: { person: DeliveryPersonColumn }) {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { mutate: updateStatus } = useMutation({
		mutationFn: (status: "available" | "offline") =>
			updateDeliveryPerson(person.id, { status }),
		onSuccess: (_, status) => {
			queryClient.invalidateQueries({ queryKey: ["delivery-persons"] });
			toast.success(`${person.name} marked as ${status}`);
		},
		onError: () => toast.error("Failed to update status"),
	});

	const { mutate: remove } = useMutation({
		mutationFn: () => deleteDeliveryPerson(person.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["delivery-persons"] });
			toast.success("Delivery person removed");
		},
		onError: () => toast.error("Failed to delete"),
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
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
						<Copy className="size-4" /> Copy Phone
					</DropdownMenuItem>
					{person.status !== "available" && person.status !== "busy" && (
						<DropdownMenuItem onClick={() => updateStatus("available")}>
							<CheckCircle className="size-4" /> Mark Available
						</DropdownMenuItem>
					)}
					{person.status !== "offline" && person.status !== "busy" && (
						<DropdownMenuItem onClick={() => updateStatus("offline")}>
							<PowerOff className="size-4" /> Mark Offline
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() =>
						router.push(`/admin/delivery-persons/${person.id}/orders`)
					}
				>
					<ExternalLink className="size-4" /> View Details
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-destructive" onClick={() => remove()}>
					<Trash2 className="size-4" /> Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const columns: ColumnDef<DeliveryPersonColumn>[] = [
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
		cell: ({ row }) => {
			const phone = row.original.phone;
			const cleaned = phone.replace(/\D/g, "");
			const formatted =
				cleaned.length === 12
					? `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
					: phone;
			return <p className="text-center">{formatted}</p>;
		},
	},
	{
		accessorKey: "status",
		header: () => <p className="text-center font-medium">Status</p>,
		cell: ({ row }) => (
			<div className="flex justify-center">
				<Badge
					variant="outline"
					className={cn(
						"font-mono uppercase",
						deliveryPersonStatusStyles[row.original.status],
					)}
				>
					{row.original.status}
				</Badge>
			</div>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <ActionsCell person={row.original} />,
	},
];

export { columns, deliveryPersonStatusStyles };
