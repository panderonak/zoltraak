"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@zoltraak/ui/components/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { columns } from "@/app/admin/products/_components/columns";
import { ProductsEmptyState } from "@/app/admin/products/_components/products-empty-state";
import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { fetchAdminProducts } from "@/http/api";
import type { AdminProductsResponse } from "@/types";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch, isRefetching } =
    useQuery<AdminProductsResponse>({
      queryKey: ["products", page],
      queryFn: () => fetchAdminProducts(page),
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
      staleTime: 120 * 1_000,
    });

  const items = data?.items ?? [];

  if (!isLoading && items.length === 0) {
    return <ProductsEmptyState />;
  }

  if (isError) {
    return <ErrorState refetch={refetch} isRefetching={isRefetching} />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-5 flex items-center justify-end px-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/products/new")}
        >
          <PlusCircle data-icon="inline-start" />
          Add Product
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={items}
        page={data?.currentPage ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Page;
