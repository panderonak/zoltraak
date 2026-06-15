import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { NavBar } from "@/components/nav-bar";
import { getServerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
	title: "Zoltraak",
	description: "User page",
};

export default async function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	if (!session) {
		return redirect("/sign-in");
	}

	const { user } = session;

	return (
		<>
			<MaxWidthWrapper>
				<NavBar user={user} />
			</MaxWidthWrapper>

			<div className="min-h-screen flex-1 md:min-h-min">{children}</div>
		</>
	);
}
