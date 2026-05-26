"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeliveryPerson } from "@zoltraak/db/schema";
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
import type * as z from "zod";
import { WarehouseSearch } from "@/components/warehouse-search";
import { createDeliveryPerson } from "@/http/api";
import { extractApiError } from "@/lib/extract-api-error";
import { deliveryPersonSchema } from "@/validators/delivery-persons";

export function DeliveryPersonForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof deliveryPersonSchema>>({
		resolver: zodResolver(deliveryPersonSchema),
		defaultValues: {
			name: "",
			phone: "",
			warehouseId: "",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["create-delivery-person"],
		mutationFn: (
			values: Pick<DeliveryPerson, "name" | "phone" | "warehouseId">,
		) => createDeliveryPerson(values),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["delivery-persons"],
			});
			toast("Delivery Person created successfully");
			form.reset();
			router.push("/admin/delivery-persons");
		},
		onError: (err) => {
			const { message } = extractApiError(err);
			toast(message);
		},
	});

	function onSubmit(values: z.infer<typeof deliveryPersonSchema>) {
		mutate(values);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Delivery Person</CardTitle>
			</CardHeader>
			<CardContent>
				<form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input
										{...field}
										id="name"
										aria-invalid={fieldState.invalid}
										placeholder="Jane Doe"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="phone"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Phone</FieldLabel>
									<Input
										{...field}
										id="phone"
										aria-invalid={fieldState.invalid}
										placeholder="+91-237-237-2370"
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
