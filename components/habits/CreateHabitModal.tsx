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
import { hanldeInserHabit } from "@/lib/actions/habits.actions";
import { useAuth } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import { Spinner } from "../ui/spinner";

const schema = z.object({
  name: z.string().min(8, "Name must be at least 8 characters"),
});
type FormData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormData, string>>;

const CreateHabitModal = () => {
  const { userId } = useAuth();
  const [values, setValues] = useState<FormData>({ name: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleCreateHabit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
      await hanldeInserHabit({
        userId: userId,
        name: result.data.name,
      });
      setIsOpen(false);
      setValues({ name: "" });
      toast.add({
        type: "success",
        title: "Success",
        description: "New Habit Added Successfully",
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form onSubmit={handleCreateHabit} id="habit-form">
        <DialogTrigger
          render={
            <Button className="bg-toffee-brown hover:bg-espresso cursor-pointer px-6 py-4.5 rounded-3xl space-x-1">
              <PlusCircle />
              <span>New</span>
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Habit</DialogTitle>
            <DialogDescription className="text-golden-chestnut">
              Create a Habit by inserting its name
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
                <Button className="cursor-pointer bg-linen text-espresso hover:bg-desert-sand hover:text-espresso py-4.5 rounded-2xl">
                  Cancel
                </Button>
              }
            />
            <Button
              form="habit-form"
              type="submit"
              disabled={isSaving}
              className="cursor-pointer bg-toffee-brown text-linen hover:bg-espresso hover:text-linen py-4.5 rounded-2xl"
            >
              {isSaving ? <Spinner /> : <span>Save</span>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateHabitModal;
