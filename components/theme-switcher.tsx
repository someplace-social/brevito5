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
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ fontSize }: { fontSize?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="grid grid-cols-1 items-center gap-2">
      <Label htmlFor="theme" className={cn(fontSize)}>
        Theme
      </Label>
      <Select value={theme ?? ""} onValueChange={setTheme}>
        <SelectTrigger className={cn(fontSize)}>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Day</SelectItem>
          <SelectItem value="dark">Night</SelectItem>
          <SelectItem value="theme-honey">Honey</SelectItem>
          <SelectItem value="theme-sage">Sage</SelectItem>
          <SelectItem value="theme-eggplant">Eggplant</SelectItem>
          <SelectItem value="theme-brick">Brick</SelectItem>
          <SelectItem value="theme-river">River</SelectItem>
          <SelectItem value="theme-granite">Granite</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}