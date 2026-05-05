"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@zoltraak/ui/components/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  columns,
  type InventoriesColumn,
} from "@/app/admin/inventories/_components/columns";
import { InventoriesEmptyState } from "@/app/admin/inventories/_components/inventories-empty-state";
import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { fetchInventories } from "@/http/api";

// TODO: Use nuqs for pagination

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch, isRefetching } =
    useQuery({
      queryKey: ["inventories", page],
      queryFn: () => fetchInventories(page),
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
      staleTime: 120 * 1_000,
    });

  const items = data?.data?.items ?? [];

  if (!isLoading && items.length === 0) {
    return <InventoriesEmptyState />;
  }

  if (isError) {
    return <ErrorState refetch={refetch} isRefetching={isRefetching} />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-5 flex items-center justify-end px-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/inventories/new")}
        >
          <PlusCircle data-icon="inline-start" />
          Add Inventory
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={items as InventoriesColumn[]}
        page={data?.data.currentPage ?? 1}
        totalPages={data?.data.totalPages ?? 1}
        onPageChange={setPage}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Page;
