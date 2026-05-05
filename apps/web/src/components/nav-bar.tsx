import Link from "next/link";
// import { Icons } from "./Icons";
// import NavItems from "./NavItems";
import { buttonVariants } from "@zoltraak/ui/components/button";
// import MobileNav from "./MobileNav";
import { Cart } from "@/components/cart";
import { NavUser } from "@/components/nav-user";
import type { User } from "better-auth";
import { FlowerIcon } from "lucide-react";
import { SidebarProvider } from "@zoltraak/ui/components/sidebar";

interface NavBarProps {
  user: User;
}

export async function NavBar({ user }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FlowerIcon className="size-5" />
          </div>
          <span className="font-bold text-xl">Zoltraak</span>
        </div>
        {user ? (
          // <UserAccountNav user={user} />
          <p>H</p>
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            Create account
          </Link>
        )}

        <div className="ml-4 flow-root lg:ml-6">
          <Cart />
        </div>
      </div>
    </header>
  );
}
