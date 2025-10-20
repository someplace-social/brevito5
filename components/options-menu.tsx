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
import { ThemeSwitcher } from "./theme-switcher";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
};

const fontSizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];
const availableCategories = ["Science", "History", "Geography"];

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
}: OptionsMenuProps) {
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
            Customize your learning experience.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          {/* Category Filter */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Categories</Label>
            <ToggleGroup
              type="multiple"
              value={selectedCategories}
              onValueChange={(value) => {
                if (value.length > 0) {
                  onSelectedCategoriesChange(value);
                }
              }}
              className="col-span-3 flex-wrap justify-start"
            >
              {availableCategories.map((category) => (
                <ToggleGroupItem key={category} value={category} className="capitalize">
                  {category}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Language and Level Selectors */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Content</Label>
            <Select value={contentLanguage} onValueChange={onContentLanguageChange}>
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
            <Select value={translationLanguage} onValueChange={onTranslationLanguageChange}>
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
            <Select value={level} onValueChange={onLevelChange}>
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
                onValueChange={(value) => onFontSizeChange(fontSizes[value[0]])}
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