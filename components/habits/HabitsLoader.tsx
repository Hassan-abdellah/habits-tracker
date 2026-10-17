import { Skeleton } from "@/components/ui/skeleton";

const HabitsLoader = () => {
  return (
    <div className="space-y-3 mt-8">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton
          key={index}
          className="bg-desert-sand/90 rounded-full w-full h-10"
        />
      ))}
    </div>
  );
};

export default HabitsLoader;
