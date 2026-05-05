"use client";

import { Button } from "@zoltraak/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@zoltraak/ui/components/field";
import { cn } from "@zoltraak/ui/lib/utils";
import { FlowerIcon } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const { error } = await signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <FlowerIcon className="size-6" />
              </div>
              <span className="sr-only">Zoltraak Inc.</span>
            </a>
            <h1 className="font-bold text-xl">Welcome to Zoltraak Inc.</h1>
          </div>
          <Field className="flex items-center justify-center">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleSignIn()}
              disabled={loading}
            >
              <FcGoogle className="size-4" />
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="/">Terms of Service</a>{" "}
        and <a href="/">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
