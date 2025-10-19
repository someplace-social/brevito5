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
import { Slider } from "@/components/ui/slider";

type OptionsMenuProps = {
  onSettingsChange: (
    contentLanguage: string,
    translationLanguage: string,
    level: string,
    fontSize: string,
  ) => void;
};

// Map slider numerical values to Tailwind CSS classes
const fontSizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];

export function OptionsMenu({ onSettingsChange }: OptionsMenuProps) {
  const [contentLanguage, setContentLanguage] = useState("Spanish");
  const [translationLanguage, setTranslationLanguage] = useState("English");
  const [level, setLevel] = useState("Beginner");
  const [fontSize, setFontSize] = useState("text-lg"); // Default font size

  // Effect to load saved settings on mount
  useEffect(() => {
    const savedContentLang = localStorage.getItem("brevito-content-language");
    const savedTranslationLang = localStorage.getItem("brevito-translation-language");
    const savedLevel = localStorage.getItem("brevito-level");
    const savedFontSize = localStorage.getItem("brevito-font-size");
    if (savedContentLang) setContentLanguage(savedContentLang);
    if (savedTranslationLang) setTranslationLanguage(savedTranslationLang);
    if (savedLevel) setLevel(savedLevel);
    if (savedFontSize && fontSizes.includes(savedFontSize)) {
      setFontSize(savedFontSize);
    }
  }, []);

  // Effect to save settings when they change
  useEffect(() => {
    localStorage.setItem("brevito-content-language", contentLanguage);
    localStorage.setItem("brevito-translation-language", translationLanguage);
    localStorage.setItem("brevito-level", level);
    localStorage.setItem("brevito-font-size", fontSize);
    onSettingsChange(contentLanguage, translationLanguage, level, fontSize);
  }, [contentLanguage, translationLanguage, level, fontSize, onSettingsChange]);

  const currentSizeIndex = fontSizes.indexOf(fontSize);

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
          {/* Language and Level Selectors */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Content</Label>
            <Select value={contentLanguage} onValueChange={setContentLanguage}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Translate To</Label>
            <Select value={translationLanguage} onValueChange={setTranslationLanguage}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
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
            <Label className="text-right">Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size Slider */}
          <div className="grid grid-cols-4 items-center gap-4 pt-2">
            <Label className="text-right">Font Size</Label>
            <div className="col-span-3 flex items-center gap-2">
              <span className="text-sm">A</span>
              <Slider
                value={[currentSizeIndex]}
                onValueChange={(value) => setFontSize(fontSizes[value[0]])}
                max={fontSizes.length - 1}
                step={1}
              />
              <span className="text-xl">A</span>
            </div>
          </div>
          
          <ThemeSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}