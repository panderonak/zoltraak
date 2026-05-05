import { Button } from "@zoltraak/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@zoltraak/ui/components/empty";
import { ArrowRightCircle, User2Icon } from "lucide-react";

import { auth } from "@zoltraak/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  if (session.user.role === "admin") {
    return redirect("/admin/products");
  }

  return (
    <Empty className="h-full bg-muted/30">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <User2Icon />
        </EmptyMedia>
        <EmptyTitle>Become a Seller</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          Start selling your products, manage orders, and grow your business—all
          in one place.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          // onClick={() => router.push("/admin/warehouses/new")}
        >
          Start Selling
          <ArrowRightCircle data-icon="inline-start" />
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default Page;
