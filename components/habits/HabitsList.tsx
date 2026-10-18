"use client";
import { Habit } from "@/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import ArchiveHabitModal from "@/components/habits/ArchiveHabitModal";
import UpdateHabitModal from "./UpdateHabitModal";
import { useOptimistic, useTransition } from "react";
import { insertCheckin } from "@/lib/actions/checkins.actions";
import { clsx } from "cn";

interface HabitItem extends Habit {
  checkedToday: boolean;
}

const HabitsList = ({ habits }: { habits: HabitItem[] }) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticHabits, flipOptimistic] = useOptimistic(
    habits, // the real state, from the server
    (
      current,
      habitId: string, //how to apply the temporary change
    ) =>
      current.map((h) =>
        h.id === habitId ? { ...h, checkedToday: !h.checkedToday } : h,
      ),
  );

  const handleToggleCheckbox = (habitId: string) => {
    startTransition(async () => {
      flipOptimistic(habitId);
      await insertCheckin(habitId);
    });
  };
  return (
    <div className="space-y-3 mt-8">
      {optimisticHabits.map((habit) => (
        <div
          key={habit.id}
          className="bg-desert-sand rounded-full py-2 px-4 text-linen flex justify-between items-center"
        >
          {/* Left Side */}
          <div className="max-w-2/3 flex items-center gap-2">
            <Checkbox
              disabled={isPending}
              checked={habit.checkedToday}
              onCheckedChange={() => handleToggleCheckbox(habit.id)}
              className="border-linen cursor-pointer border-2 data-checked:bg-espresso data-checked:border-espresso data-checked:text-linen"
            />
            <h2 className="text-lg capitalize">{habit.name}</h2>
          </div>

          {/* Right side (actions) */}

          <div className="flex items-center gap-1.5">
            <ArchiveHabitModal habitId={habit.id} />
            <UpdateHabitModal habitId={habit.id} habitName={habit.name} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitsList;
