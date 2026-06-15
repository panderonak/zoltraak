import { Separator } from "@zoltraak/ui/components/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@zoltraak/ui/components/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { getServerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
	title: "Admin",
	description: "Admin page",
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

	if (session.user.role !== "admin") {
		return redirect("/become-seller");
	}

	return (
		<SidebarProvider>
			<AppSidebar initialSession={session} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-vertical:h-4 data-vertical:self-auto"
						/>
						<h2 className="font-semibold text-xl leading-none">Dashboard</h2>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min">
						{children}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
