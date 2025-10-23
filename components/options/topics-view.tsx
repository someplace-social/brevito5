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
    setStagedCategories((currentCategories) => {
      const isCurrentlySelected = currentCategories.includes(category);
      // If it's the last category and it's selected, don't allow deselection
      if (isCurrentlySelected && currentCategories.length === 1) {
        return currentCategories;
      }
      // Toggle the category
      if (isCurrentlySelected) {
        return currentCategories.filter((c) => c !== category);
      } else {
        return [...currentCategories, category];
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
            disabled={stagedCategories.length === 1 && stagedCategories.includes(category)}
            onPressedChange={(pressed) => handleCategoryToggle(category, pressed)}
            className={cn("capitalize", fontSize, "hover:bg-accent/50")}
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