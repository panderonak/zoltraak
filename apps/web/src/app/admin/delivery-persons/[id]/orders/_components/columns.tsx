import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@zoltraak/db/schema";
import { Badge } from "@zoltraak/ui/components/badge";
import { Button } from "@zoltraak/ui/components/button";
import { format, parseISO } from "date-fns";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type DeliveryPersonOrderRow = {
	id: string;
	status: OrderStatus;
	price: number;
	address: string;
	createdAt: string;
	user: { name: string; email: string };
	orderItems: {
		quantity: number;
		price: number;
		product: { name: string };
	}[];
};

type OrderStatus = Order["status"];

export const orderStatusStyles: Record<OrderStatus, string> = {
	paid: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
	received: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
	reserved:
		"bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
	payment_pending:
		"bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
	delivered: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
	failed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const ACTIVE_STATUSES: OrderStatus[] = ["paid"];

export const isActiveOrder = (status: OrderStatus) =>
	ACTIVE_STATUSES.includes(status);

export function buildOrderColumns(
	onComplete: (orderId: string) => void,
	completing: boolean,
): ColumnDef<DeliveryPersonOrderRow>[] {
	return [
		{
			accessorKey: "status",
			header: () => <p className="text-center font-medium">Status</p>,
			cell: ({ row }) => (
				<div className="flex justify-center">
					<Badge
						variant="outline"
						className={cn(
							"font-mono uppercase",
							orderStatusStyles[row.original.status],
						)}
					>
						{row.original.status.replace("_", " ")}
					</Badge>
				</div>
			),
		},
		{
			id: "products",
			header: () => <p className="text-center font-medium">Items</p>,
			cell: ({ row }) => (
				<div className="text-center">
					{row.original.orderItems.map((item, i) => (
						<p key={i} className="text-sm">
							{item.product.name}{" "}
							<span className="text-muted-foreground"> x {item.quantity}</span>
						</p>
					))}
				</div>
			),
		},
		{
			accessorKey: "user",
			header: () => <p className="text-center font-medium">Customer</p>,
			cell: ({ row }) => (
				<p className="text-center">{row.original.user.name}</p>
			),
		},
		{
			accessorKey: "address",
			header: () => <p className="text-center font-medium">Address</p>,
			cell: ({ row }) => (
				<p className="max-w-45 truncate text-center">{row.original.address}</p>
			),
		},
		{
			accessorKey: "price",
			header: () => <p className="text-center">Price</p>,
			cell: ({ row }) => {
				const amount = Number(row.getValue("price"));

				const formatted = new Intl.NumberFormat("en-IN", {
					style: "currency",
					currency: "INR",
				}).format(amount);

				return <p className="text-center">{formatted}</p>;
			},
		},
		{
			accessorKey: "createdAt",
			header: () => <p className="text-center">Date</p>,
			cell: ({ row }) => {
				const date = parseISO(String(row.original.createdAt));

				const formatted = format(date, "dd MMM yyyy, hh:mm a");

				return <p className="text-center">{formatted}</p>;
			},
		},

		{
			id: "actions",
			cell: ({ row }) => {
				if (!isActiveOrder(row.original.status)) return null;

				return (
					<div className="flex justify-center">
						<Button
							size={"icon"}
							variant="outline"
							disabled={completing}
							onClick={() => onComplete(row.original.id)}
							className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
						>
							<CheckCircle className="size-4" />
						</Button>
					</div>
				);
			},
		},
	];
}
