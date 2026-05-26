import { auth } from "@zoltraak/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BecomeSellerView } from "@/app/(main)/become-seller/_components/become-seller-view";

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	if (session.user.role === "admin") {
		redirect("/admin/products");
	}

	return <BecomeSellerView />;
};

export default Page;
