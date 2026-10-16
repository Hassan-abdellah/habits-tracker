import { relations } from "drizzle-orm";
import { users } from "./users";
import { habits } from "./habits";
import { checkIns } from "./checkIns";

export const usersRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, { fields: [habits.userId], references: [users.clerkId] }),
  checkIns: many(checkIns),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  habit: one(habits, { fields: [checkIns.habitId], references: [habits.id] }),
}));
