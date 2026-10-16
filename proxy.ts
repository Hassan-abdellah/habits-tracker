// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

const isDev = process.env.NODE_ENV === "development";

export default clerkMiddleware({
  // Dev-only workaround for a drifting system clock. Remove once your clock is synced.
  ...(isDev && { clockSkewInMs: 10 * 60 * 1000 }),
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
