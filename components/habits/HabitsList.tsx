"use client";
import { Checkbox } from "@/components/ui/checkbox";
import ArchiveHabitModal from "@/components/habits/ArchiveHabitModal";
import UpdateHabitModal from "./UpdateHabitModal";
import { useOptimistic, useTransition } from "react";
import { insertCheckin } from "@/lib/actions/checkins.actions";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import HeatMap from "../checkins/HeatMap";
import { HabitItem } from "@/types";
import { format } from "date-fns";

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

  // the habits checked today
  const done = optimisticHabits.filter((h) => h.checkedToday).length;
  const total = optimisticHabits.length;

  return (
    <div className="mt-8 space-y-10">
      {/* Progress Bar */}

      <Progress
        value={(done / total) * 100}
        className="w-full max-w-full  rounded-full *:data-[slot=progress-track]:h-2
        **:data-[slot=progress-indicator]:bg-espresso
        "
      >
        <ProgressLabel className="text-golden-chestnut flex justify-between w-full">
          <span>{format(new Date(), "EEE dd MMM")}</span>
          <span>
            {done} / {total} done
          </span>
        </ProgressLabel>
      </Progress>

      {/* List */}
      <div className="space-y-3">
        {optimisticHabits.map((habit) => (
          <div
            key={habit.id}
            className="bg-desert-sand rounded-full py-2 px-4 text-linen flex justify-between items-center"
          >
            {/* Left Side */}
            <div className="max-w-4/5 flex items-center gap-2">
              <Checkbox
                disabled={isPending}
                checked={habit.checkedToday}
                onCheckedChange={() => handleToggleCheckbox(habit.id)}
                className="border-linen cursor-pointer border-2 data-checked:bg-espresso data-checked:border-espresso data-checked:text-linen"
              />
              <h2 className="md:text-lg text-base capitalize">{habit.name}</h2>
            </div>

            {/* Right side (actions) */}

            <div className="flex items-center gap-1.5">
              <ArchiveHabitModal habitId={habit.id} />
              <UpdateHabitModal habitId={habit.id} habitName={habit.name} />
            </div>
          </div>
        ))}
      </div>

      <HeatMap habits={habits} />
    </div>
  );
};

export default HabitsList;
