import { HabitWithCheckIns } from "@/db/schema";

export interface HabitItem extends HabitWithCheckIns {
  checkedToday: boolean;
}
