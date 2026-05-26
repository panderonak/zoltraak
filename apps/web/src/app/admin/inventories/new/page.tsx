import { InventoryForm } from "@/app/admin/inventories/_components/inventory-form";

const Page = () => {
	return (
		<main className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
			<div className="container mx-auto px-4 py-8 md:py-12">
				<InventoryForm />
			</div>
		</main>
	);
};

export default Page;
