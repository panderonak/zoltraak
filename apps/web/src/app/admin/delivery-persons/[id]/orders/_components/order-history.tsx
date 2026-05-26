"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@zoltraak/ui/components/card";
import { Skeleton } from "@zoltraak/ui/components/skeleton";
import { notFound } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  buildOrderColumns,
  type DeliveryPersonOrderRow,
} from "@/app/admin/delivery-persons/[id]/orders/_components/columns";
import { PersonSummary } from "@/app/admin/delivery-persons/[id]/orders/_components/person-summary";
import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { completeDelivery, fetchDeliveryPersonOrders } from "@/http/api";
import type { DeliveryPersonOrdersResponse } from "@/types";

export function OrderHistory({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch, isRefetching } = useQuery<{
    data: DeliveryPersonOrdersResponse;
  }>({
    queryKey: ["delivery-person-orders", id, page],
    queryFn: () => fetchDeliveryPersonOrders(id, page),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1_000,
  });

  const {
    mutate: complete,
    isPending: completing,
    isError,
  } = useMutation({
    mutationFn: (orderId: string) => completeDelivery(id, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["delivery-person-orders", id],
      });
      queryClient.invalidateQueries({ queryKey: ["delivery-persons"] });
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      toast.success("Order marked as completed");
    },
    onError: () => toast.error("Failed to complete order"),
  });

  const orderColumns = buildOrderColumns(
    (orderId) => complete(orderId),
    completing,
  );

  if (isError) {
    return <ErrorState refetch={refetch} isRefetching={isRefetching} />;
  }



  const person = data?.data?.person;

  if (!isLoading && !person) return notFound();

  const items: DeliveryPersonOrderRow[] = data?.data?.items ?? [];

  return (
    <div className="container mx-auto space-y-6 py-10">
      <div className="mb-5 px-6">
        {isLoading || !person ? (
          <PersonSummarySkeleton />
        ) : (
          <PersonSummary person={person} />
        )}
      </div>

      <DataTable
        columns={orderColumns}
        data={items}
        page={data?.data.currentPage ?? 1}
        totalPages={data?.data.totalPages ?? 1}
        onPageChange={setPage}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </div>
  );
}

export function PersonSummarySkeleton() {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            {/* Name */}
            <Skeleton className="mb-2 h-5 w-32" />

            {/* Phone + Warehouse */}
            <div className="flex flex-wrap items-center gap-x-3">
              <div className="flex items-center gap-x-1.5">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex items-center gap-x-1.5">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
