import type { Metadata } from "next";
import { Figtree, Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";
import { cn } from "cn";
import { Toaster } from "@/components/ui/toast";
import { Suspense } from "react";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker APP",
  description: "Track your daily habits today with our easy-to-use Application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", figtree.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Suspense>
          <ClerkProvider
            signInUrl="/auth/sign-in"
            afterSignOutUrl="/auth/sign-in"
            signUpUrl="/auth/sign-up"
            signInForceRedirectUrl="/"
            signUpForceRedirectUrl="/"
          >
            <Navbar />
            <main className="container">{children}</main>
          </ClerkProvider>
        </Suspense>

        <Toaster />
      </body>
    </html>
  );
}
