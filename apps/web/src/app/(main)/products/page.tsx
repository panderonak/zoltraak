// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
// import { ErrorState } from "@/components/error-state";
// import ImageSlider from "@/components/image-slider";
// import { fetchProducts } from "@/http/api";
// import type { ProductQuery } from "@/types";
// import { Loader2 } from "lucide-react";

// const Page = () => {
//   const [page, setPage] = useState(1);
//   const [category, setCategory] = useState<string | undefined>();
//   const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">(
//     "newest",
//   );

//   const query: ProductQuery = {
//     page,
//     limit: 20,
//     category,
//     sort,
//   };

//   const { data, isLoading, isFetching, isError, refetch, isRefetching } =
//     useQuery({
//       queryKey: ["products", page, category, sort],
//       queryFn: () => fetchProducts(query),
//       placeholderData: (prev) => prev,
//       staleTime: 120 * 1000,
//       refetchOnWindowFocus: false,
//     });

//   const items = data?.items ?? [];

//   if (isLoading) {
//     return (
//       <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="size-8 animate-spin text-primary" />
//           <span className="text-muted-foreground text-sm">
//             Loading products...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Empty state first (same pattern as admin)
//   if (!isLoading && items.length === 0) {
//     return <div>No products found</div>; // replace with ProductsEmptyState if you have
//   }

//   if (isError) {
//     return <ErrorState refetch={refetch} isRefetching={isRefetching} />;
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Filters */}
//       <div className="flex gap-4">
//         <select
//           onChange={(e) => {
//             setPage(1);
//             setCategory(e.target.value || undefined);
//           }}
//         >
//           <option value="">All Categories</option>
//           <option value="Fresh">Fresh</option>
//           <option value="Dairy">Dairy</option>
//           <option value="Snacks">Snacks</option>
//           <option value="Beverages">Beverages</option>
//         </select>

//         <select
//           onChange={(e) => {
//             setPage(1);
//             setSort(e.target.value as any);
//           }}
//         >
//           <option value="newest">Newest</option>
//           <option value="price_asc">Price Low → High</option>
//           <option value="price_desc">Price High → Low</option>
//         </select>
//       </div>

//       {/* Products */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {items.map((product) => (
//           <div key={product.id} className="border p-3 rounded space-y-2">
//             <ImageSlider urls={product.imageUrls} />
//             <h3 className="font-medium">{product.name}</h3>
//             <p>₹{product.price}</p>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex gap-2">
//         <button
//           type="button"
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//         >
//           Prev
//         </button>

//         <span>
//           Page {data?.page} / {data?.totalPages}
//         </span>

//         <button
//           type="button"
//           disabled={page === data?.totalPages}
//           onClick={() => setPage((p) => p + 1)}
//         >
//           Next
//         </button>
//       </div>

//       {isFetching && <p>Updating...</p>}
//     </div>
//   );
// };

// export default Page;

// HERE IS IMPROVED VERSION

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import ProductReel from "./_components/product-reel";

type Param = string | string[] | undefined;

interface ProductsPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => (typeof param === "string" ? param : undefined);

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  // const sort = parse(searchParams.sort);
  // const category = parse(searchParams.category);

  // const label = PRODUCT_CATEGORIES.find(
  //   ({ value }) => value === category,
  // )?.label;

  // const label = PRODUCT_CATEGORIES.find((value) => value === category);

  return (
    <MaxWidthWrapper>
      <ProductReel
        title="Browse Products"
        // title={label ?? "Browse Products"}
        // query={{
        //   //TODO: Use Zustand for the pagination
        //   page: 1,
        //   category,
        //   sort: sort === "price_asc" || sort === "price_desc" ? sort : "newest",
        //   limit: 20,
        // }}
      />
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
