"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Inventories, Product, Warehouse } from "@zoltraak/db/schema";
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

export type InventoriesColumn = Pick<Inventories, "id" | "sku"> & {
  warehouse: Pick<Warehouse, "name">;
  product: Pick<Product, "name">;
};

export const columns: ColumnDef<InventoriesColumn>[] = [
  {
    accessorKey: "sku",
    header: () => <p className="text-center">SKU</p>,
    cell: ({ row }) => <p className="text-center">{row.original.sku}</p>,
  },
  {
    accessorKey: "productName",
    header: () => <p className="text-center">Product</p>,
    cell: ({ row }) => (
      <p className="text-center">{row.original.product.name}</p>
    ),
  },
  {
    accessorKey: "warehouseName",
    header: () => <p className="text-center">Warehouse</p>,
    cell: ({ row }) => (
      <p className="text-center">{row.original.warehouse.name}</p>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const inventory = row.original;

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
                onClick={() => navigator.clipboard.writeText(inventory.sku)}
              >
                <Copy className="size-4" />
                Copy SKU
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
