"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { columns } from "@/app/admin/orders/_components/columns";
import { OrdersEmptyState } from "@/app/admin/orders/_components/orders-empty-state";
import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { fetchOrders } from "@/http/api";
import type { OrdersResponse } from "@/types";

const Page = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch, isRefetching } =
    useQuery<{ data: OrdersResponse }>({
      queryKey: ["orders", page],
      queryFn: () => fetchOrders(page),
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
      staleTime: 120 * 1_000, // TODO: Add it to the provider
    });

  console.log(JSON.stringify(data?.data, null, 2));

  const items = data?.data.items ?? [];

  if (!isLoading && items.length === 0) {
    return <OrdersEmptyState />;
  }

  if (isError) {
    return <ErrorState refetch={refetch} isRefetching={isRefetching} />;
  }

  return (
    <div className="container mx-auto py-10">
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
