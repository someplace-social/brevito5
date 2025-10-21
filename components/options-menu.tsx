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
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";

type OptionsMenuProps = {
  contentLanguage: string;
  onContentLanguageChange: (value: string) => void;
  translationLanguage: string;
  onTranslationLanguageChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  fontSize: string;
  onFontSizeChange: (value: string) => void;
  selectedCategories: string[];
  onSelectedCategoriesChange: (value: string[]) => void;
  showImages: boolean;
  onShowImagesChange: (value: boolean) => void;
};

const fontSizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];
const availableCategories = ["Culture", "Geography", "History", "Human Body", "Miscellaneous", "Science"];

const categoriesAreEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

export function OptionsMenu({
  contentLanguage,
  onContentLanguageChange,
  translationLanguage,
  onTranslationLanguageChange,
  level,
  onLevelChange,
  fontSize,
  onFontSizeChange,
  selectedCategories,
  onSelectedCategoriesChange,
  showImages,
  onShowImagesChange,
}: OptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [stagedContentLanguage, setStagedContentLanguage] = useState(contentLanguage);
  const [stagedTranslationLanguage, setStagedTranslationLanguage] = useState(translationLanguage);
  const [stagedLevel, setStagedLevel] = useState(level);
  const [stagedCategories, setStagedCategories] = useState(selectedCategories);

  useEffect(() => {
    if (isOpen) {
      setStagedContentLanguage(contentLanguage);
      setStagedTranslationLanguage(translationLanguage);
      setStagedLevel(level);
      setStagedCategories(selectedCategories);
    }
  }, [isOpen, contentLanguage, translationLanguage, level, selectedCategories]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const hasChanges =
        stagedContentLanguage !== contentLanguage ||
        stagedTranslationLanguage !== translationLanguage ||
        stagedLevel !== level ||
        !categoriesAreEqual(stagedCategories, selectedCategories);

      if (hasChanges) {
        onContentLanguageChange(stagedContentLanguage);
        onTranslationLanguageChange(stagedTranslationLanguage);
        onLevelChange(stagedLevel);
        onSelectedCategoriesChange(stagedCategories);
      }
    }
    setIsOpen(open);
  };

  const handleCategoryToggle = (category: string) => {
    const isCurrentlySelected = stagedCategories.includes(category);
    if (isCurrentlySelected && stagedCategories.length === 1) {
      return;
    }
    const newCategories = isCurrentlySelected
      ? stagedCategories.filter((c) => c !== category)
      : [...stagedCategories, category];
    setStagedCategories(newCategories);
  };

  const currentSizeIndex = fontSizes.indexOf(fontSize);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Options</SheetTitle>
          <SheetDescription>
            Customize your feed.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          {/* Category Filter */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Categories</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <Toggle
                  key={category}
                  variant="outline"
                  pressed={stagedCategories.includes(category)}
                  onPressedChange={() => handleCategoryToggle(category)}
                  className="capitalize"
                >
                  {category}
                </Toggle>
              ))}
            </div>
          </div>

          {/* Language and Level Selectors */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Content</Label>
            <Select value={stagedContentLanguage} onValueChange={setStagedContentLanguage}>
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
            <Label className="text-right">Translate To</Label>
            <Select value={stagedTranslationLanguage} onValueChange={setStagedTranslationLanguage}>
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
            <Select value={stagedLevel} onValueChange={setStagedLevel}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Instant Update Options */}
          <div className="grid grid-cols-4 items-center gap-4 pt-2">
            <Label className="text-right">Font Size</Label>
            <div className="col-span-3 flex items-center gap-2">
              <span className="text-sm">A</span>
              <Slider
                value={[currentSizeIndex]}
                onValueChange={(value) => onFontSizeChange(fontSizes[value[0]])}
                max={fontSizes.length - 1}
                step={1}
              />
              <span className="text-xl">A</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Show Images</Label>
            <div className="col-span-3">
              <Switch
                checked={showImages}
                onCheckedChange={onShowImagesChange}
              />
            </div>
          </div>
          
          <ThemeSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}