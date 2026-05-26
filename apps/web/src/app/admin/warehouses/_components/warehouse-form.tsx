"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Warehouse } from "@zoltraak/db/schema";
import { Button } from "@zoltraak/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { createWarehouse } from "@/http/api";
import { warehouseSchema } from "@/validators/warehouse";

export function WarehouseForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof warehouseSchema>>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      pincode: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-warehouse"],
    mutationFn: (values: Pick<Warehouse, "name" | "pincode">) =>
      createWarehouse(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast("Warehouse created successfully");
      form.reset();
      router.push("/admin/warehouses");
    },
    onError: (err) => {
      toast.error(err.message || "Unable to create warehouse");
    },
  });

  function onSubmit(values: z.infer<typeof warehouseSchema>) {
    mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-5 text-primary" />
          Warehouse Details
        </CardTitle>
        <CardDescription>Enter the warehouse location below</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="warehouse-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Delhi Central Warehouse"
                    disabled={isPending}
                  />
                  <FieldDescription>
                    Give your warehouse a descriptive name for easy
                    identification
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="pincode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pincode">Pincode</FieldLabel>
                  <Input
                    {...field}
                    id="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="302001"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  <FieldDescription>
                    Enter a valid 6-digit postal code for the warehouse location
                  </FieldDescription>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>

          <Button
            type="submit"
            form="warehouse-form"
            disabled={isPending}
            size={"lg"}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating Warehouse...
              </>
            ) : (
              "Create Warehouse"
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
