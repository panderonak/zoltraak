"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Inventories } from "@zoltraak/db/schema";
import { Button } from "@zoltraak/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@zoltraak/ui/components/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@zoltraak/ui/components/field";
import { Input } from "@zoltraak/ui/components/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ProductSearch } from "@/components/product-search";
import { WarehouseSearch } from "@/components/warehouse-search";
import { createInventory } from "@/http/api";

const formSchema = z.object({
	sku: z
		.string({ error: "SKU should be a string" })
		.length(8, { error: "SKU should be 8 characters long" }),
	warehouseId: z.uuid({ error: "Warehouse Id is not valid" }),
	productId: z.uuid({ error: "Product Id is not valid" }),
	quantity: z
		.number({ error: "Quantity is required" })
		.int()
		.min(0, { error: "Quantity cannot be negative" }),
});

export function InventoryForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sku: "",
			warehouseId: "",
			productId: "",
			quantity: 0,
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["create-inventory"],
		mutationFn: (
			values: Pick<
				Inventories,
				"sku" | "warehouseId" | "productId" | "quantity"
			>,
		) => createInventory(values),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["inventories"],
			});
			toast.success("Inventory created successfully");
			form.reset();
			router.push("/admin/inventories");
		},
		onError: (err) =>
			toast.error(err.message || "Unable to create the inventory"),
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(values);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Inventory</CardTitle>
			</CardHeader>
			<CardContent>
				<form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="sku"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="form-rhf-demo-title">SKU</FieldLabel>
									<Input
										{...field}
										id="form-rhf-demo-title"
										aria-invalid={fieldState.invalid}
										placeholder="e.g. SKU-123456"
										autoComplete="off"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="warehouseId"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Warehouse</FieldLabel>
									<FieldDescription>
										Search and select to assign a warehouse
									</FieldDescription>

									<WarehouseSearch onValueChange={field.onChange} />

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="productId"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Product</FieldLabel>
									<FieldDescription>
										Search and select to assign a product
									</FieldDescription>

									<ProductSearch onValueChange={field.onChange} />

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="quantity"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="quantity">Quantity</FieldLabel>
									<FieldDescription>
										Initial stock count for this inventory item
									</FieldDescription>

									<Input
										{...field}
										id="quantity"
										type="number"
										min={0}
										onChange={(e) => {
											const value = e.target.valueAsNumber;
											field.onChange(Number.isNaN(value) ? undefined : value);
										}}
										aria-invalid={fieldState.invalid}
										placeholder="e.g. 100"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Field orientation="horizontal">
					<Button type="button" variant="outline" onClick={() => form.reset()}>
						Reset
					</Button>

					<Button
						type="submit"
						form="form-rhf-demo"
						disabled={isPending}
						size={"lg"}
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Creating...
							</>
						) : (
							"Create"
						)}
					</Button>
				</Field>
			</CardFooter>
		</Card>
	);
}
