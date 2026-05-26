import { ProductForm } from "@/app/admin/products/_components/product-form";

const Page = () => {
	return (
		<main className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
			<div className="container mx-auto px-4 py-8 md:py-12">
				<ProductForm />
			</div>
		</main>
	);
};

export default Page;
