"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@zoltraak/ui/components/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@zoltraak/ui/components/command";
import debounce from "lodash.debounce";
import { HomeIcon, Loader2 } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { searchProducts } from "@/http/api";
import type { ProductsSearch } from "@/types";

type ProductSearchProps = {
	onValueChange: (value: string) => void;
};

export function ProductSearch({ onValueChange }: ProductSearchProps) {
	const [open, setOpen] = useState(false);
	const [debouncedInput, setDebouncedInput] = useState<string>("");
	const [searchInput, setSearchInput] = useState("");
	const [selected, setSelected] = useState("");

	const debouncedUpdate = React.useMemo(
		() =>
			debounce((value: string) => {
				setDebouncedInput(value);
			}, 300),
		[],
	);

	React.useEffect(() => {
		debouncedUpdate(searchInput);
		return () => debouncedUpdate.cancel();
	}, [searchInput, debouncedUpdate]);

	React.useEffect(() => {
		if (!open) {
			setSearchInput("");
			setDebouncedInput("");
		}
	}, [open]);

	const { data: products = [], isLoading } = useQuery<ProductsSearch>({
		queryKey: ["products", "search", debouncedInput],
		queryFn: () => searchProducts(debouncedInput.trim()),
		enabled: open && debouncedInput.trim().length > 0,
		staleTime: 1000 * 60 * 2,
	});

	function handleSelect(id: string) {
		onValueChange(id);
		setOpen(false);
		setSearchInput("");
	}

	return (
		<div className="flex flex-col gap-4">
			<Button
				onClick={() => setOpen(true)}
				variant="outline"
				className="w-full"
			>
				{selected ? selected : "Select Product"}
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<Command>
					<CommandInput
						placeholder="Type to search..."
						value={searchInput}
						onValueChange={(value) => {
							setSearchInput(value);
						}}
					/>
					<CommandList>
						{isLoading && (
							<div className="flex items-center justify-center gap-x-2 py-6">
								<Loader2 className="size-5 animate-spin" />
								<span>Searching...</span>
							</div>
						)}

						{!isLoading &&
							searchInput.trim().length > 0 &&
							products.length === 0 && (
								<CommandEmpty>No product found.</CommandEmpty>
							)}

						{!isLoading && products.length > 0 && (
							<CommandGroup heading="Name">
								{products.map((product) => (
									<CommandItem
										key={product.id}
										value={product.name}
										onSelect={() => {
											handleSelect(product.id);
											setSelected(product.name);
										}}
									>
										<HomeIcon className="mr-2 size-4" />
										<span> {product.name}</span>
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</CommandDialog>
		</div>
	);
}
