import { Habit } from "@/db/schema";
import { listActiveHabit } from "@/lib/actions/habits.actions";
import { auth } from "@clerk/nextjs/server";

const HabitsList = async () => {
  await auth.protect();

  const habitsList: Habit[] = await listActiveHabit();

  if (!habitsList.length) {
    return (
      <div className="flex items-center justify-center text-center">
        <h2>No Habits yet</h2>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {habitsList.map((habit) => (
        <div key={habit.id}>
          <h2>{habit.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default HabitsList;
