import { notFound } from "next/navigation";
import { Products } from "../_components/products";

interface PageProps {
	params: Promise<{
		id: string | string[] | undefined;
	}>;
}

const Page = async ({ params }: PageProps) => {
	const { id } = await params;

	if (typeof id !== "string") return notFound();

	return <Products productId={id.trim()} />;
};

export default Page;
