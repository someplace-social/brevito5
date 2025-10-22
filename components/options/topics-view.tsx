"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const availableCategories = ["Science", "Technology", "Health", "History", "Business", "Society", "Art", "Sports", "Environment", "Culture", "Food", "Geography", "Psychology", "Animals", "Space", "Language", "Unusual"];

type TopicsViewProps = {
  stagedCategories: string[];
  setStagedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  fontSize: string;
};

export function TopicsView({ stagedCategories, setStagedCategories, fontSize }: TopicsViewProps) {
  const handleCategoryToggle = (category: string, pressed: boolean) => {
    setStagedCategories((current) => {
      if (pressed) {
        // Add the category if it's not already there
        return current.includes(category) ? current : [...current, category];
      } else {
        // Prevent removing the last category
        if (current.length > 1) {
          return current.filter((c) => c !== category);
        }
        // If it's the last one, return a new array instance to force a re-render,
        // which will snap the toggle back to its `pressed` state.
        return [...current];
      }
    });
  };

  const handleDeselectAll = () => {
    setStagedCategories((currentCategories) => {
      // Keep at least one category selected
      return currentCategories.length > 1 ? [currentCategories[0]] : currentCategories;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {availableCategories.map((category) => (
          <Toggle
            key={category}
            variant="outline"
            pressed={stagedCategories.includes(category)}
            onPressedChange={(pressed) => handleCategoryToggle(category, pressed)}
            className={cn("capitalize", fontSize)}
          >
            {category}
          </Toggle>
        ))}
      </div>
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="secondary" onClick={() => setStagedCategories(availableCategories)} className={cn("flex-1", fontSize)}>Select All</Button>
        <Button variant="secondary" onClick={handleDeselectAll} className={cn("flex-1", fontSize)}>Deselect All</Button>
      </div>
    </div>
  );
}