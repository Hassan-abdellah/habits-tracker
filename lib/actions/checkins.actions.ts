"use server";

import { db } from "@/db";
import { checkIns, habits } from "@/db/schema";
import { getToday } from "@/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const insertCheckin = async (habitId: string) => {
  const { userId } = await auth.protect();
  // ensure ownership and active
  const habit = await db.query.habits.findFirst({
    where: and(
      eq(habits.id, habitId),
      eq(habits.userId, userId),
      isNull(habits.archivedAt),
    ),
    columns: { id: true },
  });

  if (!habit) return null;

  const todayDate = getToday();
  //   insert checkin for habit
  const inserted = await db
    .insert(checkIns)
    .values({ habitId, date: todayDate })
    .onConflictDoNothing()
    .returning({ id: checkIns.id });

  if (inserted.length > 0) {
    revalidatePath("/");
    return { checked: true };
  }
  // if insert not returning => means record already exists delete it

  await db
    .delete(checkIns)
    .where(and(eq(checkIns.habitId, habitId), eq(checkIns.date, todayDate)));

  revalidatePath("/");
  return { checked: false };
};
