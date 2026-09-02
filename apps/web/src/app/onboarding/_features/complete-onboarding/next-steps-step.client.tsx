"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Circle, PartyPopper } from "lucide-react";

type NextStepsStepProps = {
  onFinish: () => void;
};

export function NextStepsStep({ onFinish }: NextStepsStepProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
        <PartyPopper className="text-primary size-8" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Alles bereit</h1>
        <p className="text-muted-foreground text-sm">
          Ihr Projekt ist bereit. Hier sind die nächsten Schritte.
        </p>
      </div>

      <ul className="text-muted-foreground flex flex-col gap-2 text-left text-sm">
        <li className="flex items-center gap-2">
          <Circle className="size-3.5 shrink-0" />
          Website mit installiertem Widget veröffentlichen
        </li>
        <li className="flex items-center gap-2">
          <Circle className="size-3.5 shrink-0" />
          Ersten Reviewer über das Dashboard einladen
        </li>
        <li className="flex items-center gap-2">
          <Circle className="size-3.5 shrink-0" />
          Mit dem Sammeln von Feedback beginnen
        </li>
      </ul>

      <Button onClick={onFinish} className="w-full">
        Zum Dashboard
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
