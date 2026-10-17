"use client";

import { Trash2Icon, TrashIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "../ui/toast";
import { archiveHabit } from "@/lib/actions/habits.actions";
import { Spinner } from "../ui/spinner";

const ArchiveHabitModal = ({ habitId }: { habitId: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleArchiveHabit = async () => {
    if (!habitId) return;
    setIsSaving(true);
    try {
      await archiveHabit(habitId);
      setIsOpen(false);
      toast.add({
        type: "success",
        description: "Habit Archived Successfully",
        title: "Success",
      });
    } catch (error) {
      toast.add({
        type: "error",
        description: `Error Happened ${error}`,
        title: "Error",
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            aria-label="Archive Habit"
            className="bg-transparent cursor-pointer rounded-lg px-1.5"
          >
            <TrashIcon className="size-4.5" />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Archive Habit?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive this habit? you can view it any
            time at Archived Section
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            className="cursor-pointer hover:bg-desert-sand hover:text-linen"
            disabled={isSaving}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            disabled={isSaving}
            onClick={() => handleArchiveHabit()}
          >
            {isSaving ? <Spinner /> : <span>Archive</span>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ArchiveHabitModal;
