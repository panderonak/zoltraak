import { auth } from "@zoltraak/auth";
import { Badge } from "@zoltraak/ui/components/badge";
import { buttonVariants } from "@zoltraak/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@zoltraak/ui/components/card";
import { Separator } from "@zoltraak/ui/components/separator";
import {
	CheckCircle2,
	Clock,
	FlowerIcon,
	IndianRupee,
	Package,
	Shield,
	Smartphone,
	Star,
	TrendingUp,
	Zap,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		return redirect("/products");
	}

	return (
		<main className="w-full bg-background text-foreground">
			<MaxWidthWrapper>
				<header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
					<div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<FlowerIcon className="size-5" />
							</div>
							<span className="font-bold text-xl">Zoltraak</span>
						</div>
						<Link
							href="/sign-in"
							className={buttonVariants({
								variant: "default",
							})}
						>
							Sign In
						</Link>
					</div>
				</header>
			</MaxWidthWrapper>

			<section className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24">
				<div className="container mx-auto max-w-6xl">
					<div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
						<div className="flex flex-col gap-6 sm:gap-8">
							<div className="flex flex-col gap-4">
								<Badge variant="secondary" className="w-fit">
									<Zap className="mr-1 size-3" />
									Delivered in minutes, not hours
								</Badge>
								<h1 className="text-balance font-bold text-4xl leading-tight sm:text-5xl md:text-6xl">
									Groceries at your door in{" "}
									<span className="text-primary">15 minutes</span>
								</h1>
								<p className="text-balance text-lg text-muted-foreground sm:text-xl">
									Milk, fruits, snacks, and daily essentials — delivered fast,
									fresh, and right when you need them.
								</p>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
								<Link
									href="/sign-in"
									className={buttonVariants({
										variant: "default",
									})}
								>
									Browse Products
								</Link>
							</div>

							<div className="flex flex-col gap-4 pt-4 sm:flex-row sm:gap-8">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-green-600" />
									<span className="font-medium text-sm">
										Freshness you can trust
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-green-600" />
									<span className="font-medium text-sm">Free Delivery</span>
								</div>
							</div>
						</div>

						<div className="relative h-72 overflow-hidden rounded-xl sm:h-96 lg:h-full lg:min-h-125">
							<Image
								src="/assets/hero-quick-commerce.jpg"
								alt="Quick commerce delivery service showing fast delivery of groceries and packages"
								fill
								className="object-cover"
								priority
							/>

							<div className="absolute inset-0 bg-linear-to-t from-background/50 to-transparent" />
						</div>
					</div>
				</div>
			</section>

			<section
				id="features"
				className="w-full border-border border-t bg-muted/30 px-4 py-12 sm:px-6 sm:py-16 md:py-20"
			>
				<div className="container mx-auto max-w-6xl">
					<div className="mb-12 text-center">
						<h2 className="text-balance font-bold text-3xl sm:text-4xl md:text-5xl">
							Why Zoltraak?
						</h2>
						<p className="mt-4 text-balance text-lg text-muted-foreground">
							Built for speed. Designed for everyday life.
						</p>
					</div>

					{/* Feature Cards Grid */}
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{/* Fast Delivery */}
						<Card className="border-none shadow-sm transition-shadow hover:shadow-md">
							<CardHeader>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
									<Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<CardTitle className="text-xl">Lightning Fast</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									Get your order in 15 minutes or less. No waiting, no planning
									ahead.
								</p>
							</CardContent>
						</Card>

						<Card className="border-none shadow-sm transition-shadow hover:shadow-md">
							<CardHeader>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
									<Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
								</div>
								<CardTitle className="text-xl">Super Simple</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									Search, add, and checkout in seconds. No clutter, no
									confusion.
								</p>
							</CardContent>
						</Card>

						<Card className="border-none shadow-sm transition-shadow hover:shadow-md">
							<CardHeader>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
									<Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
								</div>
								<CardTitle className="text-xl">Huge Selection</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									Groceries, snacks, and essentials — everything you need in one
									place.
								</p>
							</CardContent>
						</Card>

						<Card className="border-none shadow-sm transition-shadow hover:shadow-md">
							<CardHeader>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
									<IndianRupee className="h-6 w-6 text-orange-600 dark:text-orange-400" />
								</div>
								<CardTitle className="text-xl">Easy Payments</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									Pay instantly with UPI, cards, or wallets. Fast, secure,
									hassle-free.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section
				id="benefits"
				className="w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20"
			>
				<div className="container mx-auto max-w-6xl">
					<div className="mb-12 text-center">
						<h2 className="text-balance font-bold text-3xl sm:text-4xl md:text-5xl">
							How It Works
						</h2>
					</div>

					<div className="mb-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
						<div className="order-2 flex flex-col gap-6 lg:order-1">
							<h3 className="font-bold text-2xl">Shop with Confidence</h3>
							<p className="text-lg text-muted-foreground leading-relaxed">
								Browse fresh groceries and daily essentials, carefully selected
								for quality and value.
							</p>
							<ul className="space-y-3">
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>Fresh produce, restocked daily</span>
								</li>
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>Quality checked before delivery</span>
								</li>
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>Fair, transparent pricing</span>
								</li>
							</ul>
						</div>
						<div className="relative order-1 flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 sm:h-96 lg:order-2">
							<Package className="h-32 w-32 text-primary/20" />
						</div>
					</div>

					<div className="mb-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
						<div className="flex flex-col gap-6">
							<h3 className="font-bold text-2xl">Lightning-Fast Delivery</h3>
							<p className="text-lg text-muted-foreground leading-relaxed">
								Place your order and we handle the rest. Our nearby hubs ensure
								quick dispatch and delivery.
							</p>
							<ul className="space-y-3">
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>Average delivery in 15 minutes </span>
								</li>
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>24/7 delivery availability</span>
								</li>
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>Reliable delivery partners</span>
								</li>
							</ul>
						</div>
						<div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 sm:h-96">
							<Clock className="h-32 w-32 text-primary/20" />
						</div>
					</div>

					<div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
						<div className="order-2 flex flex-col gap-6 lg:order-1">
							<h3 className="font-bold text-2xl">Safe & Secure Payments</h3>
							<p className="text-lg text-muted-foreground leading-relaxed">
								Your payments and data are protected with trusted, secure
								systems.
							</p>
							<ul className="space-y-3">
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>Secure checkout</span>
								</li>
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>Multiple UPI options</span>
								</li>
								<li className="flex gap-3">
									<CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
									<span>Easy refunds if something goes wrong</span>
								</li>
							</ul>
						</div>
						<div className="relative order-1 flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 sm:h-96 lg:order-2">
							<Shield className="h-32 w-32 text-primary/20" />
						</div>
					</div>
				</div>
			</section>

			<footer className="w-full border-border border-t bg-muted/50 px-4 py-12 sm:px-6 md:py-16">
				<div className="container mx-auto max-w-6xl">
					<div className="mb-8 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-2">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
									<FlowerIcon className="h-5 w-5" />
								</div>
								<span className="font-bold text-lg">Zoltraak</span>
							</div>
							<p className="text-muted-foreground text-sm">
								The fastest way to get groceries delivered
							</p>
						</div>

						<div>
							<h4 className="mb-4 font-semibold">Product</h4>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Download App
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Pricing
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Security
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold">Company</h4>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										About Us
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Careers
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Contact
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold">Legal</h4>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Cookie Policy
									</a>
								</li>
								<li>
									<a
										href="/"
										className="transition-colors hover:text-foreground"
									>
										Accessibility
									</a>
								</li>
							</ul>
						</div>
					</div>

					<Separator className="my-8" />

					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-muted-foreground text-sm">
							© 2024 Zoltraak. All rights reserved.
						</p>
						<div className="flex gap-4">
							<a
								href="/"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								<span className="sr-only">Twitter</span>
								<TrendingUp className="h-5 w-5" />
							</a>
							<a
								href="/"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								<span className="sr-only">Facebook</span>
								<Package className="h-5 w-5" />
							</a>
							<a
								href="/"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								<span className="sr-only">LinkedIn</span>
								<Star className="h-5 w-5" />
							</a>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}
