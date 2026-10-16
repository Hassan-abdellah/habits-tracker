"use server";

import { db } from "@/db";
import { habits, NewHabit } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const hanldeInserHabit = async (values: NewHabit) => {
  if (!values.userId) return { ok: false, message: "User ID Not Provided" };
  if (!values.name) return { ok: false, message: "Name is Required" };
  const { userId, name } = values;

  try {
    await db
      .insert(habits)
      .values({
        userId,
        name,
      })
      .onConflictDoNothing();

    revalidatePath("/");
    return { ok: true, message: "Habit Added Successfully" };
  } catch (error) {
    console.log("error", error);
    return { ok: false, message: "Error Happened" };
  }
};
export const listActiveHabit = async () => {
  const { userId } = await auth.protect();
  return await db.query.habits.findMany({
    where: and(eq(habits.userId, userId), isNull(habits.archivedAt)),
    orderBy: desc(habits.createdAt),
  });
};
