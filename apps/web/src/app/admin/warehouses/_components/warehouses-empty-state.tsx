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

export function WarehousesEmptyState() {
	const router = useRouter();
	return (
		<Empty className="h-full bg-muted/30">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<BoxIcon />
				</EmptyMedia>
				<EmptyTitle>No Warehouses</EmptyTitle>
				<EmptyDescription className="max-w-xs text-pretty">
					No warehouses are available to display.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					variant="outline"
					onClick={() => router.push("/admin/warehouses/new")}
				>
					<PlusCircle data-icon="inline-start" />
					Add Warehouse
				</Button>
			</EmptyContent>
		</Empty>
	);
}
