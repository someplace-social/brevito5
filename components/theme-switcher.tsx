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

type ThemeSwitcherProps = {
  fontSize?: string;
  stagedTheme: string | undefined;
  setStagedTheme: (theme: string) => void;
};

export function ThemeSwitcher({ fontSize, stagedTheme, setStagedTheme }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply the theme change whenever the staged theme changes
  useEffect(() => {
    if (stagedTheme) {
      setTheme(stagedTheme);
    }
  }, [stagedTheme, setTheme]);

  if (!mounted || !stagedTheme) {
    return (
      <div className="grid grid-cols-1 items-center gap-2">
        <Label htmlFor="theme" className={cn(fontSize)}>
          Theme
        </Label>
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-center gap-2">
      <Label htmlFor="theme" className={cn(fontSize)}>
        Theme
      </Label>
      <Select value={stagedTheme} onValueChange={setStagedTheme}>
        <SelectTrigger className={cn(fontSize)}>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light" className={cn(fontSize)}>Day</SelectItem>
          <SelectItem value="dark" className={cn(fontSize)}>Night</SelectItem>
          <SelectItem value="theme-honey" className={cn(fontSize)}>Honey</SelectItem>
          <SelectItem value="theme-sage" className={cn(fontSize)}>Sage</SelectItem>
          <SelectItem value="theme-eggplant" className={cn(fontSize)}>Eggplant</SelectItem>
          <SelectItem value="theme-brick" className={cn(fontSize)}>Brick</SelectItem>
          <SelectItem value="theme-river" className={cn(fontSize)}>River</SelectItem>
          <SelectItem value="theme-granite" className={cn(fontSize)}>Granite</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}