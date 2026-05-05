import { Card } from "@zoltraak/ui/components/card";
import { Skeleton } from "@zoltraak/ui/components/skeleton";

export function ProductsSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden flex flex-col h-full">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-6 w-1/4 mt-2" />
            <Skeleton className="h-9 w-full mt-2" />
          </div>
        </Card>
      ))}
    </div>
  );
}
