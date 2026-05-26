import { Building2 } from "lucide-react";
import { WarehouseForm } from "@/app/admin/warehouses/_components/warehouse-form";

const Page = () => {
	return (
		<main className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
			<div className="container mx-auto px-4 py-8 md:py-12">
				<div className="mx-auto max-w-xl">
					<div className="mb-8 flex flex-col items-start gap-3">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-primary/10 p-2">
								<Building2 className="size-6 text-primary" />
							</div>
							<h1 className="font-bold text-3xl text-foreground md:text-4xl">
								Add Warehouse
							</h1>
						</div>
						<p className="text-base text-muted-foreground">
							Create a new warehouse listing by providing the essential details
							below.
						</p>
					</div>
					<WarehouseForm />
				</div>
			</div>
		</main>
	);
};

export default Page;
