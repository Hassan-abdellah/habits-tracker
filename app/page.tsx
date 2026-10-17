import CreateHabitModal from "@/components/habits/CreateHabitModal";
import HabitsLoader from "@/components/habits/HabitsLoader";
import HabitsSection from "@/components/habits/HabitsSection";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <section className="py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Habits</h1>
        <CreateHabitModal />
      </div>

      {/* List */}
      <Suspense fallback={<HabitsLoader />}>
        <HabitsSection />
      </Suspense>
    </section>
  );
};

export default HomePage;
