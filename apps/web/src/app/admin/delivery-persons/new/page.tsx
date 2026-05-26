import { DeliveryPersonForm } from "@/app/admin/delivery-persons/_components/delivery-persons-form";

const Page = () => {
	return (
		<main className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
			<div className="container mx-auto px-4 py-8 md:py-12">
				<DeliveryPersonForm />
			</div>
		</main>
	);
};

export default Page;
