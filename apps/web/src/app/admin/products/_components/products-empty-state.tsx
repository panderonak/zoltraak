import { Button } from "@zoltraak/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zoltraak/ui/components/empty";
import { BoxIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProductsEmptyState() {
	const router = useRouter();
	return (
		<Empty className="h-full bg-muted/30">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<BoxIcon />
				</EmptyMedia>
				<EmptyTitle>No Products</EmptyTitle>
				<EmptyDescription className="max-w-xs text-pretty">
					No products are available to display.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					variant="outline"
					onClick={() => router.push("/admin/products/new")}
				>
					<PlusCircle data-icon="inline-start" />
					Add Product
				</Button>
			</EmptyContent>
		</Empty>
	);
}
