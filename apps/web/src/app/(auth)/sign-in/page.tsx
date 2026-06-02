import { auth } from "@zoltraak/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
