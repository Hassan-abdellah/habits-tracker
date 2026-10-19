import { CheckIn } from "@/db/schema";
import { HabitItem } from "@/types";
import { genereateDaysListBack } from "@/utils";
import { clsx } from "cn";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const HeatMap = ({ habits }: { habits: HabitItem[] }) => {
  const days = genereateDaysListBack();
  // check if the habit has checkins for certain day
  const isHabitChecked = (checkins: CheckIn[], day: string) => {
    return checkins.some((checkin) => checkin.date === day);
  };
  return (
    <ScrollArea className="w-full">
      <div className="flex flex-col gap-2 md:items-center items-start px-2 py-4">
        {habits.map((habit) => (
          <div className="flex gap-1" key={habit.id}>
            {days.map((day) => (
              <div
                key={day}
                className={clsx(
                  "size-5 rounded-sm transition-colors duration-150",
                  isHabitChecked(habit.checkIns, day)
                    ? "bg-espresso"
                    : "bg-toffee-brown/10",
                )}
              />
            ))}
          </div>
        ))}
        <ScrollBar
          orientation="horizontal"
          className="bg-desert-sand/50 rounded-full **:data-[slot=scroll-area-thumb]:bg-toffee-brown cursor-grab"
        />
      </div>
    </ScrollArea>
  );
};

export default HeatMap;
