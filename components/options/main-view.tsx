"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Languages, LayoutGrid, Palette } from "lucide-react";

type MainViewProps = {
  setActiveView: (view: "topics" | "language" | "appearance") => void;
};

export function MainView({ setActiveView }: MainViewProps) {
  return (
    <nav className="flex flex-col gap-2">
      <button onClick={() => setActiveView("topics")} className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-accent transition-colors">
        <div className="flex items-center gap-4">
          <LayoutGrid className="text-muted-foreground" />
          <span className="text-lg">Topics</span>
        </div>
        <ChevronRight className="text-muted-foreground" />
      </button>
      <button onClick={() => setActiveView("language")} className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-accent transition-colors">
        <div className="flex items-center gap-4">
          <Languages className="text-muted-foreground" />
          <span className="text-lg">Language</span>
        </div>
        <ChevronRight className="text-muted-foreground" />
      </button>
      <button onClick={() => setActiveView("appearance")} className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-accent transition-colors">
        <div className="flex items-center gap-4">
          <Palette className="text-muted-foreground" />
          <span className="text-lg">Appearance</span>
        </div>
        <ChevronRight className="text-muted-foreground" />
      </button>
    </nav>
  );
}