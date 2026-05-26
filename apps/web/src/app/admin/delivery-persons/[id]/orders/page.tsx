import { notFound } from "next/navigation";
import { OrderHistory } from "@/app/admin/delivery-persons/[id]/orders/_components//order-history";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  if (!id || typeof id !== "string") return notFound();

  return <OrderHistory id={id} />;
};

export default Page;
