import { auth } from "@zoltraak/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Cart } from "@/components/cart";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
	title: "Zoltraak",
	description: "User page",
};

export default async function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

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
