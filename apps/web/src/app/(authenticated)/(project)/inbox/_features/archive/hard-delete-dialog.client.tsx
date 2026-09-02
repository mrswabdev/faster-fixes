"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Trash2 } from "lucide-react";

type HardDeleteDialogProps = {
  count: number;
  onConfirm: () => void;
  disabled?: boolean;
};

export function HardDeleteDialog({
  count,
  onConfirm,
  disabled,
}: HardDeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={disabled}>
          <Trash2 className="mr-1 size-3" />
          Löschen {count > 1 ? `(${count})` : ""}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Feedback dauerhaft löschen</AlertDialogTitle>
          <AlertDialogDescription>
            Dadurch werden {count}{" "}
            {count === 1 ? "Feedback-Eintrag" : "Feedback-Einträge"} und{" "}
            {count === 1 ? "der zugehörige Screenshot" : "die zugehörigen Screenshots"} dauerhaft
            gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Dauerhaft löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
