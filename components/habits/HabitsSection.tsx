import { HabitWithCheckIns } from "@/db/schema";
import { listActiveHabit } from "@/lib/actions/habits.actions";
import { auth } from "@clerk/nextjs/server";
import HabitsList from "./HabitsList";
import { getToday } from "@/utils";

const HabitsSection = async () => {
  await auth.protect();

  const habitsList: HabitWithCheckIns[] = await listActiveHabit();

  if (!habitsList.length) {
    return (
      <div className="flex items-center justify-center text-center">
        <h2>No Habits yet</h2>
      </div>
    );
  }
  const todayDate = getToday();
  const habits = habitsList.map((h) => ({
    ...h,
    checkedToday: h.checkIns.some((checkin) => checkin.date === todayDate),
  }));
  return <HabitsList habits={habits} />;
};

export default HabitsSection;
