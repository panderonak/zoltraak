import { redirect } from "next/navigation";
import { BecomeSellerView } from "@/app/(main)/become-seller/_components/become-seller-view";
import { getServerSession } from "@/lib/auth-server";

const Page = async () => {
	const session = await getServerSession();

	if (!session) {
		redirect("/sign-in");
	}

	if (session.user.role === "admin") {
		redirect("/admin/products");
	}

	return <BecomeSellerView />;
};

export default Page;
