"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

type OptionsMenuProps = {
  onSettingsChange: (language: string, level: string) => void;
};

export function OptionsMenu({ onSettingsChange }: OptionsMenuProps) {
  const [language, setLanguage] = useState("Spanish");
  const [level, setLevel] = useState("Beginner");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // This effect runs once on the client to set the mounted state
  // and load saved language/level settings.
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem("brevito-language");
    const savedLevel = localStorage.getItem("brevito-level");
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedLevel) setLevel(savedLevel);
  }, []);

  // This effect runs whenever language or level settings change to save them.
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("brevito-language", language);
      localStorage.setItem("brevito-level", level);
      onSettingsChange(language, level);
    }
  }, [language, level, onSettingsChange, mounted]);

  // We must wait for the component to mount before rendering the UI.
  // This prevents hydration mismatch errors and state inconsistencies.
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Settings />
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Options</SheetTitle>
          <SheetDescription>
            Choose your language, level, and theme.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Level
            </Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              Theme
            </Label>
            {/* Using `theme ?? ""` ensures the value is never undefined */}
            <Select value={theme ?? ""} onValueChange={setTheme}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Daybreak</SelectItem>
                <SelectItem value="dark">Midnight</SelectItem>
                <SelectItem value="theme-dusk">Dusk</SelectItem>
                <SelectItem value="theme-forest">Forest</SelectItem>
                <SelectItem value="theme-coast">Coast</SelectItem>
                <SelectItem value="theme-autumn">Autumn</SelectItem>
                <SelectItem value="theme-sage">Sage</SelectItem>
                <SelectItem value="theme-eggplant">Eggplant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}