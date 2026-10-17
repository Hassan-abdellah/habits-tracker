import { Habit } from "@/db/schema";
import { listActiveHabit } from "@/lib/actions/habits.actions";
import { auth } from "@clerk/nextjs/server";
import HabitsList from "./HabitsList";

const HabitsSection = async () => {
  await auth.protect();

  const habitsList: Habit[] = await listActiveHabit();

  if (!habitsList.length) {
    return (
      <div className="flex items-center justify-center text-center">
        <h2>No Habits yet</h2>
      </div>
    );
  }
  return <HabitsList habits={habitsList} />;
};

export default HabitsSection;
