import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zoltraak/ui/components/empty";
import { Blocks } from "lucide-react";

export function OrdersEmptyState() {
	return (
		<Empty className="h-full bg-muted/30">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Blocks />
				</EmptyMedia>
				<EmptyTitle>No Orders</EmptyTitle>
				<EmptyDescription className="max-w-xs text-pretty">
					No Orders are available to display.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
