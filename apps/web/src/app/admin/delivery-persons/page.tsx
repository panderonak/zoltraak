"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@zoltraak/ui/components/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { columns } from "@/app/admin/delivery-persons/_components/columns";
import { DeliveryPersonsEmptyState } from "@/app/admin/delivery-persons/_components/delivery-persons-empty-state";
import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { fetchDeliveryPersons } from "@/http/api";
import type { DeliveryPersonResponse } from "@/types";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch, isRefetching } =
    useQuery<{ data: DeliveryPersonResponse }>({
      queryKey: ["delivery-persons", page],
      queryFn: () => fetchDeliveryPersons(page),
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
      staleTime: 120 * 1_000,
    });


  const items = data?.data.items ?? [];

  if (!isLoading && items.length === 0) {
    return <DeliveryPersonsEmptyState />;
  }

  if (isError) {
    return <ErrorState refetch={refetch} isRefetching={isRefetching} />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-5 flex items-center justify-end px-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/delivery-persons/new")}
        >
          Add Delivery Person
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
