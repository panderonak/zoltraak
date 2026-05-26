import { Button } from "@zoltraak/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zoltraak/ui/components/empty";
import { Blocks, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function InventoriesEmptyState() {
	const router = useRouter();
	return (
		<Empty className="h-full bg-muted/30">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Blocks />
				</EmptyMedia>
				<EmptyTitle>No Inventories</EmptyTitle>
				<EmptyDescription className="max-w-xs text-pretty">
					No inventories are available to display.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					variant="outline"
					onClick={() => router.push("/admin/inventories/new")}
				>
					<PlusCircle data-icon="inline-start" />
					Add Inventory
				</Button>
			</EmptyContent>
		</Empty>
	);
}
