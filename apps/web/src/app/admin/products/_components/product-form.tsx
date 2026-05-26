"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@zoltraak/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@zoltraak/ui/components/card";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@zoltraak/ui/components/field";
import { Input } from "@zoltraak/ui/components/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@zoltraak/ui/components/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zoltraak/ui/components/select";
import axios from "axios";
import { Cloud, Dot, Loader2, Trash, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import * as z from "zod";
import { FileItem } from "@/app/admin/products/_components/file-item";
import { MAX_FILES, MAX_SIZE } from "@/config";
import { api } from "@/lib/axios";
import { formatFileSize } from "@/lib/format-file-size";
import { cn } from "@/lib/utils";
import type { FileWithProgress } from "@/types";
import { categories, productSchema } from "@/validators/product";

export function ProductForm() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [files, setFiles] = useState<FileWithProgress[]>([]);
	const [isDragActive, setIsDragActive] = useState(false);
	const [uploading, setUploading] = useState(false);

	const form = useForm<z.infer<typeof productSchema>>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: "",
			description: "",
			category: "" as (typeof categories)[number],
			price: "",
			images: [],
		},
	});

	const {
		formState: { isSubmitting },
	} = form;

	const addFiles = (_files: FileList, onChange: (files: File[]) => void) => {
		if (files.length + _files.length > MAX_FILES) {
			return;
		}

		const newFiles = Array.from(_files).map((file) => ({
			id: uuid(),
			file,
			preview: URL.createObjectURL(file),
			progress: 0,
			uploaded: false,
		}));

		setFiles([...files, ...newFiles]);

		onChange([...files, ...newFiles].map((file) => file.file));
	};

	const handleFileDrop = (
		e: React.DragEvent<HTMLElement>,
		onChange: (files: File[]) => void,
	) => {
		e.preventDefault();

		e.stopPropagation();

		setIsDragActive(false);

		if (isSubmitting) {
			return;
		}

		if (e.dataTransfer.files) {
			addFiles(e.dataTransfer.files, onChange);
		}
	};

	const removeFileById = (id: string) => {
		const file = files.find((file) => file.id === id);

		if (file) {
			URL.revokeObjectURL(file.preview);
			const updatedFiles = files.filter((file) => file.id !== id);

			setFiles(updatedFiles);

			form.setValue(
				"images",
				updatedFiles.map((file) => file.file),
				{ shouldValidate: updatedFiles.length > 0 },
			);
		}
	};

	const clearAllFiles = () => {
		files.map((file) => URL.revokeObjectURL(file.preview));

		setFiles([]);

		form.resetField("images");
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);
	};

	async function onSubmit(values: z.infer<typeof productSchema>) {
		setUploading(true);

		const { name, description, price, category } = values;

		try {
			// 1. Get presigned URLs
			const res = await api.post(
				"/products/presigned-urls",
				{
					files: files.map((file) => ({
						id: file.id,
						file: file.file.name,
					})),
				},
				{
					withCredentials: true,
				},
			);

			const preSignedUrls: { id: string; url: string; filename: string }[] =
				res.data.preSignedUrls;

			// 2. Upload files FIRST (important)
			await Promise.all(
				preSignedUrls.map(({ id, url }) => {
					const fileEntry = files.find((file) => file.id === id);

					if (!fileEntry) return Promise.resolve();

					return axios.put(url, fileEntry.file, {
						headers: { "Content-Type": fileEntry.file.type },
						onUploadProgress: (progressEvent) => {
							const progress = Math.round(
								(progressEvent.loaded * 100) / (progressEvent.total || 1),
							);

							setFiles((prevFiles) =>
								prevFiles.map((file) =>
									file.id === id
										? { ...file, progress, uploaded: progress === 100 }
										: file,
								),
							);
						},
					});
				}),
			);

			// 3. Create product AFTER uploads
			await api.post(
				"/products/admin",
				{
					name,
					description,
					price,
					category,
					images: preSignedUrls.map(({ filename }) => filename),
				},
				{
					withCredentials: true,
				},
			);

			toast.success("Products have been successfully created! ✌🏻");
			queryClient.invalidateQueries({ queryKey: ["products"] });
			router.push("/admin/products");
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(error.issues[0].message);
			} else {
				toast.error("Unable to create the product");
			}
		} finally {
			setUploading(false);
			clearAllFiles();
			form.reset();
		}
	}

	useEffect(() => {
		return () => {
			files.map((file) => URL.revokeObjectURL(file.preview));
		};
	}, [files]);

	return (
		<div className="mx-auto max-w-2xl">
			<div className="mb-8 text-center md:text-left">
				<h1 className="mb-2 font-bold text-3xl text-foreground md:text-4xl">
					Add Product Details
				</h1>
				<p className="text-base text-muted-foreground">
					Fill in the information below to create your product listing
				</p>
			</div>

			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Card className="border-border/50 shadow-lg">
					<CardHeader className="border-border/50 border-b">
						<CardTitle className="text-xl">Product Information</CardTitle>
						<CardDescription>Enter your product details below</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6 pt-6">
						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="name">
											Product Name <span className="text-destructive">*</span>
										</FieldLabel>
										<Input
											{...field}
											id="name"
											aria-invalid={fieldState.invalid}
											placeholder="Enter your product name"
											autoComplete="off"
										/>

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="description"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="description">
											Product Description{" "}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												{...field}
												id="description"
												placeholder="Describe what makes your product special"
												rows={6}
												className="min-h-24 resize-none"
												aria-invalid={fieldState.invalid}
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="tabular-nums">
													{field.value.length}/ 100 characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="category"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field
										orientation="responsive"
										data-invalid={fieldState.invalid}
									>
										<FieldContent>
											<FieldLabel htmlFor="form-rhf-select-category">
												Select Category
											</FieldLabel>
											<FieldDescription>
												To organize the products, select the category for this
												product.
											</FieldDescription>
											{/* {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )} */}
										</FieldContent>
										<Select
											name={field.name}
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id="form-rhf-select-category"
												aria-invalid={fieldState.invalid}
												className="min-w-30"
											>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent alignItemWithTrigger>
												{categories.map((category) => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>

							<Controller
								name="price"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="price">
											Price (INR) <span className="text-destructive">*</span>
										</FieldLabel>

										<Input
											{...field}
											id="price"
											type="number"
											min={1}
											max={999_999.99}
											aria-invalid={fieldState.invalid}
											placeholder="0.00"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</CardContent>
				</Card>

				<Card className="border-border/50 shadow-lg">
					<CardHeader className="border-border/50 border-b">
						<CardTitle className="flex items-center gap-2 text-xl">
							<Upload className="size-5" />
							Product Images
						</CardTitle>
						<CardDescription>
							Upload up to {MAX_FILES} product images (max{" "}
							{formatFileSize(MAX_SIZE)} each)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Controller
							name="images"
							control={form.control}
							render={({ field, fieldState }) => (
								<>
									<FieldLabel className="pb-3" htmlFor="product-image-input">
										Product Images
										<span className="text-destructive">*</span>
									</FieldLabel>

									{fieldState.error && (
										<p className="mb-2 text-destructive text-sm">
											{fieldState.error.message}
										</p>
									)}

									<div
										className={cn(
											"rounded-lg border-2 border-dashed",
											"border-border/50 bg-muted/30 transition-colors",
											fieldState.error && "border-destructive",
											isSubmitting && "opacity-50",
											isDragActive && "border-primary bg-primary/10",
										)}
									>
										<input
											ref={field.ref}
											type="file"
											id="product-image-input"
											multiple
											className="sr-only"
											accept="image/*"
											onChange={(e) => {
												if (e.target.files) {
													addFiles(e.target.files, field.onChange);
												}
											}}
										/>

										<label
											htmlFor="product-image-input"
											onDragOver={handleDragOver}
											onDragLeave={handleDragLeave}
											onDrop={(e) => handleFileDrop(e, field.onChange)}
											className={cn(
												"flex cursor-pointer flex-col items-center justify-center gap-3 p-8 md:p-10",
												"rounded-md text-center transition-all",
												"hover:border-primary/50 hover:bg-muted/50",
												"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
												isDragActive && "border-primary bg-primary/10",
											)}
										>
											<div
												className={cn(
													"rounded-lg p-3 transition-colors",
													isDragActive ? "bg-primary/20" : "bg-primary/10",
												)}
											>
												<Cloud className="size-6 text-primary" />
											</div>

											<div>
												<p className="font-semibold text-base text-foreground">
													Drag product images here
												</p>
												<p className="mt-1 text-muted-foreground text-sm">
													or click to browse your device
												</p>
											</div>

											<div className="mt-2 space-y-1 text-muted-foreground text-xs">
												<p>Supported formats: JPG, PNG, WebP</p>
												<p className="flex items-center">
													Max {formatFileSize(MAX_SIZE)} MB per file <Dot /> Up
													to {MAX_FILES} files
												</p>
											</div>
										</label>
									</div>
								</>
							)}
						/>
						{files.length > 0 && (
							<div className="mt-6 space-y-3">
								<div className="flex items-center justify-between">
									<h3>
										Selected Files ({files.length} / {MAX_FILES})
									</h3>
									<div className="flex items-center gap-x-3">
										<Button
											variant={"secondary"}
											size={"sm"}
											onClick={clearAllFiles}
										>
											<Trash size={18} />
											Clear All
										</Button>
									</div>
								</div>
								<ul className="max-h-80 space-y-3 overflow-y-auto rounded-lg bg-muted/50 p-3">
									{files.map((file) => (
										<FileItem
											key={file.id}
											file={file}
											onRemove={removeFileById}
											uploading={uploading}
										/>
									))}
								</ul>
							</div>
						)}
					</CardContent>
				</Card>

				<div className="flex flex-col gap-3 sm:flex-row">
					<Button
						type="submit"
						disabled={isSubmitting || uploading || files.length === 0}
						size={"lg"}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Creating Product...
							</>
						) : (
							"Create Product"
						)}
					</Button>
					<Button
						type="button"
						variant={"outline"}
						disabled={isSubmitting || files.length === 0}
						onClick={() => form.reset()}
						size={"lg"}
					>
						Clear
					</Button>
				</div>
			</form>
		</div>
	);
}
