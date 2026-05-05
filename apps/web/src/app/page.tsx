import { Badge } from "@zoltraak/ui/components/badge";
import { Button, buttonVariants } from "@zoltraak/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@zoltraak/ui/components/card";
import { Separator } from "@zoltraak/ui/components/separator";
import {
  ArrowRight,
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
import Image from "next/image";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

// import { auth } from "@zoltraak/auth";
// import { headers } from "next/headers";

import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // if (session) {
  //   return redirect("/products");
  // }

  return (
    <main className="w-full bg-background text-foreground">
      {/* Header/Navigation */}
      <MaxWidthWrapper>
        <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FlowerIcon className="size-5" />
              </div>
              <span className="font-bold text-xl">Zoltraak</span>
            </div>
            <Button
            //  onClick={() => redirect("/sign-in")}
            >
              Sign In
            </Button>
          </div>
        </header>
      </MaxWidthWrapper>

      <section className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Hero Content */}
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

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {/* <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  // onClick={() => redirect("/sign-in")}
                >
                  Get Started <ArrowRight className="ml-2 size-4" />
                </Button> */}

                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Sign in
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Browse Products
                </Button>
              </div>

              {/* Trust Indicators */}
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

            {/* Hero Image */}
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

            {/* <div className="relative h-72 overflow-hidden rounded-xl sm:h-96 lg:h-full lg:min-h-125">
              <Image
                src="/assets/hero-quick-commerce.jpg"
                alt="Quick commerce delivery service showing fast delivery of groceries and packages"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-linear-to-t from-background/50 to-transparent" />
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
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

            {/* Easy to Use */}
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

            {/* Wide Selection */}
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

            {/* Real-time Tracking */}
            <Card className="border-none shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <IndianRupee className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">Easy Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pay instantly with UPI, cards, or wallets. Fast, secure,
                  hassle-free.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section with Alternating Layout */}
      <section
        id="benefits"
        className="w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl text-balance">
              How It Works
            </h2>
          </div>

          {/* Benefit 1 */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center mb-16">
            <div className="order-2 lg:order-1 flex flex-col gap-6">
              <h3 className="text-2xl font-bold">Shop with Confidence</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Browse fresh groceries and daily essentials, carefully selected
                for quality and value.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>Fresh produce, restocked daily</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>Quality checked before delivery</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>Fair, transparent pricing</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative h-72 sm:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Package className="h-32 w-32 text-primary/20" />
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center mb-16">
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold">Lightning-Fast Delivery</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Place your order and we handle the rest. Our nearby hubs ensure
                quick dispatch and delivery.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>Average delivery in 15 minutes </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>24/7 delivery availability</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>Reliable delivery partners</span>
                </li>
              </ul>
            </div>
            <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Clock className="h-32 w-32 text-primary/20" />
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 flex flex-col gap-6">
              <h3 className="text-2xl font-bold">Safe & Secure Payments</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your payments and data are protected with trusted, secure
                systems.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>Secure checkout</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>Multiple UPI options</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span>Easy refunds if something goes wrong</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative h-72 sm:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Shield className="h-32 w-32 text-primary/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full border-t border-border bg-muted/30 px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Stat 1 */}
            <Card className="border-none shadow-sm text-center">
              <CardHeader>
                <CardTitle className="text-4xl sm:text-5xl font-bold text-primary">
                  50K+
                </CardTitle>
                <CardDescription className="text-lg">Customers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  People who trust us for daily essentials
                </p>
              </CardContent>
            </Card>

            {/* Stat 2 */}
            <Card className="border-none shadow-sm text-center">
              <CardHeader>
                <CardTitle className="text-4xl sm:text-5xl font-bold text-primary">
                  100K+
                </CardTitle>
                <CardDescription className="text-lg">
                  Orders Delivered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fast, reliable deliveries every day
                </p>
              </CardContent>
            </Card>

            {/* Stat 3 */}
            <Card className="border-none shadow-sm text-center">
              <CardHeader>
                <CardTitle className="text-4xl sm:text-5xl font-bold text-primary">
                  4.8★
                </CardTitle>
                <CardDescription className="text-lg">Rating</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Loved for speed and convenience
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        id="cta"
        className="relative w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:py-28"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/0 to-primary/5" />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold sm:text-5xl md:text-6xl text-balance mb-6">
            Get your groceries in minutes
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8">
            Sign up now and get 50% off your first order. No waiting, no hassle.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 justify-center">
            <Button size="lg" className="text-base h-12 px-8">
              Download App
            </Button>
            <Button size="lg" variant="outline" className="text-base h-12 px-8">
              Continue on Web
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Available on iOS, Android, and web. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-muted/50 px-4 py-12 sm:px-6 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 mb-8">
            {/* Company */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FlowerIcon className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold">Zoltraak</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The fastest way to get groceries delivered
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Download App
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 Zoltraak. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <TrendingUp className="h-5 w-5" />
              </a>
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Package className="h-5 w-5" />
              </a>
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
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

// const Page = () => {
//   const perks = [
//     {
//       name: "Instant Delivery",
//       Icon: ArrowDownToLine,
//       description:
//         "Get your assets delivered to your email in seconds and download them right away.",
//     },
//     {
//       name: "Guaranteed Quality",
//       Icon: CheckCircle,
//       description:
//         "Every asset on our platform is verified by our team to ensure our highest quality standards. Not happy? We offer a 30-day refund guarantee.",
//     },
//     {
//       name: "For the Planet",
//       Icon: Leaf,
//       description:
//         "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
//     },
//   ];
//   return (
//     <>
//       <MaxWidthWrapper>
//         <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
//           <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
//             Your marketplace for high-quality{" "}
//             <span className="text-blue-600">digital assets</span>.
//           </h1>
//           <p className="mt-6 text-lg max-w-prose text-muted-foreground">
//             Welcome to DigitalHippo. Every asset on our platform is verified by
//             our team to ensure our highest quality standards.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 mt-6">
//             <Link href="/" className={buttonVariants()}>
//               Browse Trending
//             </Link>
//             <Button variant="ghost">Our quality promise &rarr;</Button>
//           </div>
//         </div>

//         {/* <ProductReel
//           query={{ sort: "desc", limit: 4 }}
//           href="/products?sort=recent"
//           title="Brand new"
//         /> */}
//       </MaxWidthWrapper>

//       <section className="border-t border-gray-200 bg-gray-50">
//         <MaxWidthWrapper className="py-20">
//           <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
//             {perks.map((perk) => (
//               <div
//                 key={perk.name}
//                 className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
//               >
//                 <div className="md:flex-shrink-0 flex justify-center">
//                   <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
//                     {<perk.Icon className="w-1/3 h-1/3" />}
//                   </div>
//                 </div>

//                 <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
//                   <h3 className="text-base font-medium text-gray-900">
//                     {perk.name}
//                   </h3>
//                   <p className="mt-3 text-sm text-muted-foreground">
//                     {perk.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </MaxWidthWrapper>
//       </section>
//     </>
//   );
// };

// export default Page;
