import CreateHabitModal from "@/components/CreateHabitModal";
import HabitsList from "@/components/HabitsList";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <section className="py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Habits</h1>
        <CreateHabitModal />
      </div>

      {/* List */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-center text-xl">
            <h2>Loading...</h2>
          </div>
        }
      >
        <HabitsList />
      </Suspense>
    </section>
  );
};

export default HomePage;
