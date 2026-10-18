"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateHabitName } from "@/lib/actions/habits.actions";
import { useAuth } from "@clerk/nextjs";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import { Spinner } from "../ui/spinner";

const schema = z.object({
  name: z
    .string()
    .min(8, "Name must be at least 8 characters")
    .max(100, "Name Must be at least 100 Characters"),
});
type FormData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormData, string>>;

const UpdateHabitModal = ({
  habitName,
  habitId,
}: {
  habitName: string;
  habitId: string;
}) => {
  const { userId } = useAuth();
  const [values, setValues] = useState<FormData>({ name: habitName });
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleUpdateHabit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = schema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormData;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (!userId) return;
    setErrors({});
    setIsSaving(true);
    try {
      await updateHabitName(habitId, result.data.name);
      setIsOpen(false);
      toast.add({
        type: "success",
        title: "Success",
        description: "New Habit Updated Successfully",
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form onSubmit={handleUpdateHabit} id="habit-form-update">
        <DialogTrigger
          render={
            <Button className="bg-transparent hover:bg-espresso cursor-pointer border-0 px-1.5 m-0">
              <PencilIcon className="md:size-4.5 size-4" />
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Habit</DialogTitle>
            <DialogDescription className="text-golden-chestnut">
              Update a Habit Name
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-3">
            <Label htmlFor="habit-name">Name</Label>
            <Input
              id="habit-name"
              name="name"
              placeholder="Reading 20 Minutes Per Day"
              value={values.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="focus-visible:ring-desert-sand"
            />

            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button className="cursor-pointer bg-linen text-espresso hover:bg-desert-sand hover:text-espresso py-4.5 px-6 rounded-2xl">
                  Cancel
                </Button>
              }
            />
            <Button
              form="habit-form-update"
              type="submit"
              disabled={isSaving}
              className="cursor-pointer bg-toffee-brown text-linen hover:bg-espresso hover:text-linen py-4.5 px-6 rounded-2xl"
            >
              {isSaving ? <Spinner /> : <span>Save</span>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default UpdateHabitModal;
