import { CheckIn } from "@/db/schema";
import { HabitItem } from "@/types";
import { genereate1MonthBack } from "@/utils";
import { clsx } from "cn";

const HeatMap = ({ habits }: { habits: HabitItem[] }) => {
  const days = genereate1MonthBack();
  // check if the habit has checkins for certain day
  const isHabitChecked = (checkins: CheckIn[], day: string) => {
    return checkins.some((checkin) => checkin.date === day);
  };
  return (
    <div className="space-y-2 w-full">
      {habits.map((habit) => (
        <div className="flex items-center gap-0.5" key={habit.id}>
          {days.map((day) => (
            <div
              key={day}
              className={clsx(
                "size-4 rounded-sm",
                isHabitChecked(habit.checkIns, day)
                  ? "bg-espresso"
                  : "bg-white/50",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default HeatMap;
