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
import { ThemeSwitcher } from "./theme-switcher";

type OptionsMenuProps = {
  onSettingsChange: (language: string, level: string) => void;
};

export function OptionsMenu({ onSettingsChange }: OptionsMenuProps) {
  const [language, setLanguage] = useState("Spanish");
  const [level, setLevel] = useState("Beginner");

  // Effect to load saved settings on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("brevito-language");
    const savedLevel = localStorage.getItem("brevito-level");
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedLevel) setLevel(savedLevel);
  }, []);

  // Effect to save settings when they change
  useEffect(() => {
    localStorage.setItem("brevito-language", language);
    localStorage.setItem("brevito-level", level);
    onSettingsChange(language, level);
  }, [language, level, onSettingsChange]);

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
          {/* Use the new, isolated theme switcher component */}
          <ThemeSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}