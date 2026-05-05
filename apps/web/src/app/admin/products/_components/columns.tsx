"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@zoltraak/db/schema";
import { Button, buttonVariants } from "@zoltraak/ui/components/button";
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
import { ArrowUpDown, Copy, ExternalLink, MoreVertical } from "lucide-react";

export type ProductColumn = Pick<
  Product,
  "id" | "name" | "price" | "category"
> & {
  updatedAt: string | Date;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-1 size-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return <p className="text-center">{row.original.name}</p>;
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
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
    accessorKey: "category",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => {
      return <p className="text-center">{row.original.category}</p>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-center">Updated At</div>,
    cell: ({ row }) => {
      const date = parseISO(String(row.original.updatedAt));

      const formatted = format(date, "dd MMM yyyy, hh:mm a");

      return <p className="text-center">{formatted}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

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
                onClick={() => navigator.clipboard.writeText(product.name)}
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
