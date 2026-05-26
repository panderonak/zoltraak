"use client";

import { useMutation } from "@tanstack/react-query";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { becomeSeller } from "@/http/api";

export function BecomeSellerView() {
	const router = useRouter();

	const { mutate, isPending } = useMutation({
		mutationFn: becomeSeller,
		onSuccess: () => {
			toast.success("Welcome! Your seller account is ready.");
			router.push("/admin/products");
		},
		onError: () => {
			toast.error("Something went wrong. Please try again.");
		},
	});

	return (
		<div className="flex flex-1 flex-col">
			<Empty className="flex-1 bg-muted/30">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<User2Icon />
					</EmptyMedia>
					<EmptyTitle>Become a Seller</EmptyTitle>
					<EmptyDescription className="max-w-xs text-pretty">
						Start selling your products, manage orders, and grow your
						business—all in one place.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button
						variant="outline"
						onClick={() => mutate()}
						disabled={isPending}
					>
						{isPending ? "Setting Up..." : "Start Selling"}
						<ArrowRightCircle data-icon="inline-start" />
					</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
}
