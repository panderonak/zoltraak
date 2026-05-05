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

export function DeliveryPersonsEmptyState() {
	const router = useRouter();
	return (
		<Empty className="h-full bg-muted/30">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<BoxIcon />
				</EmptyMedia>
				<EmptyTitle>No Delivery Persons</EmptyTitle>
				<EmptyDescription className="max-w-xs text-pretty">
					No delivery persons are available to display.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					variant="outline"
					onClick={() => router.push("/admin/delivery-persons/new")}
				>
					<PlusCircle data-icon="inline-start" />
					Add Product
				</Button>
			</EmptyContent>
		</Empty>
	);
}
