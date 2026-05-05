"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@zoltraak/ui/components/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { columns } from "@/app/admin/warehouses/_components/columns";
import { WarehousesEmptyState } from "@/app/admin/warehouses/_components/warehouses-empty-state";
import DataTable from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { fetchWarehouses } from "@/http/api";
import type { WarehouseResponse } from "@/types";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch, isRefetching } =
    useQuery<{ data: WarehouseResponse }>({
      queryKey: ["warehouses", page],
      queryFn: () => fetchWarehouses(page),
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
      staleTime: 120 * 1_000,
      // TODO: Add the stale time in the query provider for consistency
    });

  console.log(JSON.stringify(data?.data, null, 2));

  const items = data?.data.items ?? [];

  if (!isLoading && items.length === 0) {
    return <WarehousesEmptyState />;
  }

  if (isError) {
    return <ErrorState refetch={refetch} isRefetching={isRefetching} />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-5 flex items-center justify-end px-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/warehouses/new")}
        >
          <PlusCircle data-icon="inline-start" />
          Add Warehouse
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={items}
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
