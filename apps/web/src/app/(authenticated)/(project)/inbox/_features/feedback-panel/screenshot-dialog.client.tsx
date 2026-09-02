"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

type ScreenshotDialogProps = {
  src: string;
};

export function ScreenshotDialog({ src }: ScreenshotDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="cursor-zoom-in">
          <img
            src={src}
            alt="Feedback-Screenshot"
            className="w-full rounded-md border"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100vh-2rem)] overflow-auto rounded-none border-none p-0 sm:max-w-[calc(100%-2rem)]">
        <DialogTitle className="sr-only">Screenshot-Vorschau</DialogTitle>
        <DialogDescription className="sr-only">
          Feedback-Screenshot in voller Größe
        </DialogDescription>
        <img
          src={src}
          alt="Feedback-Screenshot"
          className="h-full w-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
