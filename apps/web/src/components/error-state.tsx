import { IconCloudQuestion } from "@tabler/icons-react";
import { Button } from "@zoltraak/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zoltraak/ui/components/empty";
import { RefreshCcwIcon } from "lucide-react";

export function ErrorState({
	refetch,
	isRefetching,
}: {
	refetch: () => void;
	isRefetching: boolean;
}) {
	return (
		<Empty className="h-full bg-muted/30">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconCloudQuestion />
				</EmptyMedia>
				<EmptyTitle>Something Went Wrong</EmptyTitle>
				<EmptyDescription className="max-w-xs text-pretty">
					We couldn&apos;t load your data. Please try again.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					variant="outline"
					onClick={() => refetch()}
					disabled={isRefetching}
				>
					{isRefetching ? (
						<>
							<RefreshCcwIcon className="animate-spin" />
							Refreshing...
						</>
					) : (
						<>
							<RefreshCcwIcon />
							Refresh
						</>
					)}
				</Button>
			</EmptyContent>
		</Empty>
	);
}
