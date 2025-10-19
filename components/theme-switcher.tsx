"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When the component mounts on the client, set mounted to true.
  useEffect(() => {
    setMounted(true);
  }, []);

  // If the component is not yet mounted, we can show a skeleton loader.
  // This prevents a hydration mismatch.
  if (!mounted) {
    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="theme" className="text-right">
          Theme
        </Label>
        <Skeleton className="h-9 w-full col-span-3" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="theme" className="text-right">
        Theme
      </Label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Daybreak</SelectItem>
          <SelectItem value="dark">Midnight</SelectItem>
          <SelectItem value="theme-dusk">Dusk</SelectItem>
          <SelectItem value="theme-forest">Forest</SelectItem>
          <SelectItem value="theme-meadow">Meadow</SelectItem>
          <SelectItem value="theme-sage">Sage</SelectItem>
          <SelectItem value="theme-eggplant">Eggplant</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}