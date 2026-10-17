"use server";

import { db } from "@/db";
import { habits, NewHabit } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

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
export const archiveHabit = async (habitId: string) => {
  const { userId } = await auth.protect();
  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.userId, userId), eq(habits.id, habitId)),
  });

  // check if this habit belongs to this user
  if (!habit) {
    return { ok: false, message: "Habit with this Id not found" };
  }

  // check ownership to this user
  if (habit?.userId !== userId) {
    return {
      ok: false,
      message: "You are not authorized to Update this habit",
    };
  }

  await db
    .update(habits)
    .set({ archivedAt: new Date() })
    .where(
      and(
        eq(habits.id, habitId),
        eq(habits.userId, userId),
        isNull(habits.archivedAt),
      ),
    );

  revalidatePath("/");
  return { ok: true };
};

const habitSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .min(8, { error: "Must be 8 Chars at Least" })
    .max(100, { error: "Must be 100 Chars Max" }),
});

export const updateHabitName = async (habitId: string, habitName: string) => {
  const { userId } = await auth.protect();

  if (!habitId || !habitName)
    return { ok: false, message: "Id or Name are missing" };

  const parsed = habitSchema.safeParse({ id: habitId, name: habitName });
  if (!parsed.success) return { ok: false, error: parsed.error };

  const habit = await db.query.habits.findFirst({
    where: and(eq(habits.userId, userId), eq(habits.id, habitId)),
  });

  // check if this habit belongs to this user
  if (!habit) {
    return { ok: false, message: "Habit with this Id not found" };
  }

  // check ownership to this user
  if (habit?.userId !== userId) {
    return {
      ok: false,
      message: "You are not authorized to Update this habit",
    };
  }

  await db
    .update(habits)
    .set({ name: habitName })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));

  revalidatePath("/");
  return { ok: true };
};
