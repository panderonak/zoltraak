"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Order, User } from "@zoltraak/db/schema";
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
import { format, parseISO } from "date-fns";
import { Copy, ExternalLink, MoreVertical } from "lucide-react";

export type OrdersColumn = Pick<Order, "id" | "price" | "status"> & {
  user: Pick<User, "name">;
  orderItems: {
    quantity: number;
    product: {
      name: string;
    };
  }[];
  createdAt: string | Date;
};

export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "id",
    header: () => <p className="text-center font-medium">Order ID</p>,
    cell: ({ row }) => (
      <p className="text-center">{row.original.id.slice(0, 8)}</p>
    ),
  },
  {
    id: "customer",
    header: () => <p className="text-center font-medium">Customer</p>,
    cell: ({ row }) => <p className="text-center">{row.original.user.name}</p>,
  },
  {
    id: "quantity",
    header: () => <p className="text-center font-medium">Qty</p>,
    cell: ({ row }) => {
      const quantity = row.original.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      return <p className="text-center">{quantity}</p>;
    },
  },
  {
    accessorKey: "price",
    header: () => <p className="text-center font-medium">Price</p>,
    cell: ({ row }) => (
      <p className="text-center font-medium">₹{row.original.price}</p>
    ),
  },
  {
    accessorKey: "status",
    header: () => <p className="text-center font-medium">Status</p>,
    cell: ({ row }) => (
      <p className="text-center capitalize">{row.original.status}</p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Updated At</div>,
    cell: ({ row }) => {
      const date = parseISO(String(row.original.createdAt));

      const formatted = format(date, "dd MMM yyyy, hh:mm a");

      return <p className="text-center">{formatted}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({
              variant: "ghost",
              size: "icon-sm",
            })}
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                <Copy className="size-4" />
                Copy Order ID
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
