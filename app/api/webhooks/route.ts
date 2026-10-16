// app/api/webhooks/route.ts
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }

  try {
    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const d = evt.data;
        const email =
          d.email_addresses.find((e) => e.id === d.primary_email_address_id)
            ?.email_address ?? d.email_addresses[0]?.email_address;

        if (!email) break; // nothing useful to store yet

        await db
          .insert(users)
          .values({
            clerkId: d.id,
            email,
            firstName: d.first_name,
            lastName: d.last_name,
            imageUrl: d.image_url,
          })
          .onConflictDoUpdate({
            target: users.clerkId,
            set: {
              email,
              firstName: d.first_name,
              lastName: d.last_name,
              imageUrl: d.image_url,
              updatedAt: new Date(),
            },
          });
        break;
      }

      case "user.deleted": {
        if (evt.data.id) {
          await db.delete(users).where(eq(users.clerkId, evt.data.id));
        }
        break;
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    // 500 makes Clerk retry the event
    console.error("Webhook handler failed:", err);
    return new Response("Handler error", { status: 500 });
  }
}
