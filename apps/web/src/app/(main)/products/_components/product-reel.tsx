"use client";

import { IconFilter2 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { PRODUCT_CATEGORIES } from "@zoltraak/config";
import { Button } from "@zoltraak/ui/components/button";
import { Card, CardContent } from "@zoltraak/ui/components/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@zoltraak/ui/components/empty";
import { Label } from "@zoltraak/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@zoltraak/ui/components/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@zoltraak/ui/components/sheet";
import { LucideBox, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ErrorState } from "@/components/error-state";
import { fetchProducts } from "@/http/api";
import type { ProductQuery, ProductsResponse, Sort } from "@/types";
import ProductListing from "./product-listing";

type Props = {
  title: string;
};

const ProductReel = ({ title }: Props) => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | undefined>();
  const [sort, setSort] = useState<Sort>("newest");

  const query: ProductQuery = {
    page,
    limit: 20,
    category,
    sort,
  };

  const { data, isLoading, isFetching, isError, refetch, isRefetching } =
    useQuery<ProductsResponse>({
      queryKey: ["products", page, category, sort],
      queryFn: () => fetchProducts(query),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
      staleTime: 120000,
    });

  const products = data?.items ?? [];

  let map: ((typeof products)[0] | null)[] = [];

  if (isLoading || isFetching) {
    map = new Array(query.limit ?? 8).fill(null);
  } else {
    map = products;
  }

  const sortBy = [
    { label: "Newest", value: "newest" },
    { label: "Lowest Price", value: "price_asc" },
    { label: "Highest Price", value: "price_desc" },
  ];

  if (isError) {
    return (
      <div className="flex h-screen flex-1 flex-col gap-4 p-4">
        <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
          <ErrorState refetch={refetch} isRefetching={isRefetching} />
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="mb-4 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="font-bold text-2xl sm:text-3xl">{title}</h1>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between">
          <p className="text-base">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {products.length}
            </span>{" "}
            products
          </p>
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline">
                  <IconFilter2 className="size-4" />
                  Filters
                </Button>
              }
            />
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Apply filters</SheetTitle>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                  <Label htmlFor="category-select">Category</Label>
                  <Select
                    value={category ?? null}
                    onValueChange={(value) => {
                      setPage(1);
                      setCategory((value as string) ?? undefined);
                    }}
                  >
                    <SelectTrigger className="w-full" id="category-select">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {PRODUCT_CATEGORIES.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="sort-select">Sort</Label>
                  <Select<Sort>
                    items={sortBy}
                    value={sort}
                    onValueChange={(value) => {
                      if (value === null) return;

                      setPage(1);
                      setSort(value);
                    }}
                  >
                    <SelectTrigger className="w-full" id="sort-select">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sort</SelectLabel>
                        {sortBy.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPage(1);
                    setCategory(undefined);
                    setSort("newest");
                  }}
                >
                  <RotateCcw className="size-4" />
                  Reset Filters
                </Button>
                <SheetClose render={<Button variant="outline">Close</Button>} />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>

      {!isLoading && !isFetching && products.length === 0 ? (
        <Empty className="mt-10 flex items-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LucideBox />
            </EmptyMedia>
            <EmptyTitle>No Product Found</EmptyTitle>
            <EmptyDescription>
              Try changing your filters or browse other categories to discover
              more.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPage(1);
                setCategory(undefined);
                setSort("newest");
              }}
            >
              <RotateCcw className="size-4" />
              Reset Filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="relative">
          <div className="mt-6 flex w-full items-center">
            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10-base:gap-x-8">
              {map.map((product, i) => (
                <ProductListing
                  key={`product-${i}-${product?.id}`}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReel;
