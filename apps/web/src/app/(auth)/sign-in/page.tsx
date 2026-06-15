import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { getServerSession } from "@/lib/auth-server";

export default async function SignInPage() {
	const session = await getServerSession();

	if (session) {
		return redirect("/products");
	}
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignInForm />
			</div>
		</div>
	);
}
