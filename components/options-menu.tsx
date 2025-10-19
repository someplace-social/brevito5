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
  onSettingsChange: (contentLanguage: string, translationLanguage: string, level: string) => void;
};

export function OptionsMenu({ onSettingsChange }: OptionsMenuProps) {
  const [contentLanguage, setContentLanguage] = useState("Spanish");
  const [translationLanguage, setTranslationLanguage] = useState("English");
  const [level, setLevel] = useState("Beginner");

  // Effect to load saved settings on mount
  useEffect(() => {
    const savedContentLang = localStorage.getItem("brevito-content-language");
    const savedTranslationLang = localStorage.getItem("brevito-translation-language");
    const savedLevel = localStorage.getItem("brevito-level");
    if (savedContentLang) setContentLanguage(savedContentLang);
    if (savedTranslationLang) setTranslationLanguage(savedTranslationLang);
    if (savedLevel) setLevel(savedLevel);
  }, []);

  // Effect to save settings when they change
  useEffect(() => {
    localStorage.setItem("brevito-content-language", contentLanguage);
    localStorage.setItem("brevito-translation-language", translationLanguage);
    localStorage.setItem("brevito-level", level);
    onSettingsChange(contentLanguage, translationLanguage, level);
  }, [contentLanguage, translationLanguage, level, onSettingsChange]);

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
            Choose your content and translation languages.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content-language" className="text-right">
              Content
            </Label>
            <Select value={contentLanguage} onValueChange={setContentLanguage}>
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
            <Label htmlFor="translation-language" className="text-right">
              Translate To
            </Label>
            <Select value={translationLanguage} onValueChange={setTranslationLanguage}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
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
          <ThemeSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}