// "use client";

// import type { ColumnDef } from "@tanstack/react-table";
// import type { Inventories, Product, Warehouse } from "@zoltraak/db/schema";
// import { buttonVariants } from "@zoltraak/ui/components/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@zoltraak/ui/components/dropdown-menu";
// import { Copy, ExternalLink, MoreVertical } from "lucide-react";

// export type InventoriesColumn = Pick<Inventories, "id" | "sku"> & {
//   warehouse: Pick<Warehouse, "name">;
//   product: Pick<Product, "name">;
// };

// export const columns: ColumnDef<InventoriesColumn>[] = [
//   {
//     accessorKey: "sku",
//     header: () => <p className="text-center">SKU</p>,
//     cell: ({ row }) => <p className="text-center">{row.original.sku}</p>,
//   },
//   {
//     accessorKey: "productName",
//     header: () => <p className="text-center">Product</p>,
//     cell: ({ row }) => (
//       <p className="text-center">{row.original.product.name}</p>
//     ),
//   },
//   {
//     accessorKey: "warehouseName",
//     header: () => <p className="text-center">Warehouse</p>,
//     cell: ({ row }) => (
//       <p className="text-center">{row.original.warehouse.name}</p>
//     ),
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const inventory = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger
//             className={buttonVariants({
//               variant: "ghost",
//               size: "icon-sm",
//             })}
//           >
//             <span className="sr-only">Open menu</span>
//             <MoreVertical className="size-4" />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuGroup>
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>

//               <DropdownMenuItem
//                 onClick={() => navigator.clipboard.writeText(inventory.sku)}
//               >
//                 <Copy className="size-4" />
//                 Copy SKU
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem>
//               <ExternalLink className="size-4" />
//               View Details
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import type { Inventories, Product, Warehouse } from "@zoltraak/db/schema";
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
import { Copy, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteInventory } from "@/http/api";

export type InventoriesColumn = Pick<Inventories, "id" | "sku" | "quantity"> & {
  warehouse: Pick<Warehouse, "name">;
  product: Pick<Product, "name">;
};

function ActionsCell({ inventory }: { inventory: InventoriesColumn }) {
  const queryClient = useQueryClient();

  const { mutate: remove } = useMutation({
    mutationFn: () => deleteInventory(inventory.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      toast.success("Inventory item removed");
    },
    onError: () => toast.error("Failed to delete inventory"),
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
            onClick={() => navigator.clipboard.writeText(inventory.sku)}
          >
            <Copy className="size-4" /> Copy SKU
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => remove()}>
          <Trash2 className="size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<InventoriesColumn>[] = [
  {
    accessorKey: "sku",
    header: () => <p className="text-center">SKU</p>,
    cell: ({ row }) => (
      <p className="text-center uppercase">{row.original.sku}</p>
    ),
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
    accessorKey: "quantity",
    header: () => <p className="text-center">Quantity</p>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant={row.original.quantity === 0 ? "destructive" : "secondary"}
          className="font-mono uppercase"
        >
          {row.original.quantity === 0 ? "Out of stock" : row.original.quantity}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell inventory={row.original} />,
  },
];
