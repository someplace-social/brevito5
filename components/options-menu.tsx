"use client";

import {
  Sheet,
  SheetContent,
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
import { ArrowLeft, ChevronRight, Languages, LayoutGrid, Palette, Image as ImageIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

type OptionsMenuProps = {
  triggerIcon: ReactNode;
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
const availableCategories = ["Science", "Technology", "Health", "History", "Business", "Society", "Art", "Sports", "Environment", "Culture", "Food", "Geography", "Psychology", "Animals", "Space", "Language", "Unusual"];

const categoriesAreEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

type View = "main" | "topics" | "language" | "appearance";

// A dedicated component for the appearance preview
function AppearancePreviewCard({ fontSize, showImage }: { fontSize: string; showImage: boolean }) {
  return (
    <Card className="w-full overflow-hidden">
      {showImage && (
        <div className="bg-muted aspect-[16/9] w-full flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        <p className={cn("leading-tight", fontSize)}>
          This is how the text will look. Adjust the slider below to change the size.
        </p>
        <div className="flex gap-2 text-xs">
          <div className="flex-1 p-2 rounded-sm bg-primary text-primary-foreground text-center">Primary</div>
          <div className="flex-1 p-2 rounded-sm bg-secondary text-secondary-foreground text-center">Secondary</div>
          <div className="flex-1 p-2 rounded-sm bg-accent text-accent-foreground text-center">Accent</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OptionsMenu({
  triggerIcon,
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
  const [activeView, setActiveView] = useState<View>("main");

  // Staged state for all settings
  const [stagedContentLanguage, setStagedContentLanguage] = useState(contentLanguage);
  const [stagedTranslationLanguage, setStagedTranslationLanguage] = useState(translationLanguage);
  const [stagedLevel, setStagedLevel] = useState(level);
  const [stagedCategories, setStagedCategories] = useState(selectedCategories);
  const [stagedFontSize, setStagedFontSize] = useState(fontSize);
  const [stagedShowImages, setStagedShowImages] = useState(showImages);

  // Sync staged state when the menu opens
  useEffect(() => {
    if (isOpen) {
      setStagedContentLanguage(contentLanguage);
      setStagedTranslationLanguage(translationLanguage);
      setStagedLevel(level);
      setStagedCategories(selectedCategories);
      setStagedFontSize(fontSize);
      setStagedShowImages(showImages);
    }
  }, [isOpen, contentLanguage, translationLanguage, level, selectedCategories, fontSize, showImages]);

  // Apply all staged changes when the menu is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const hasChanges =
        stagedContentLanguage !== contentLanguage ||
        stagedTranslationLanguage !== translationLanguage ||
        stagedLevel !== level ||
        !categoriesAreEqual(stagedCategories, selectedCategories) ||
        stagedFontSize !== fontSize ||
        stagedShowImages !== showImages;

      if (hasChanges) {
        onContentLanguageChange(stagedContentLanguage);
        onTranslationLanguageChange(stagedTranslationLanguage);
        onLevelChange(stagedLevel);
        onSelectedCategoriesChange(stagedCategories);
        onFontSizeChange(stagedFontSize);
        onShowImagesChange(stagedShowImages);
      }
    } else {
      setActiveView("main");
    }
    setIsOpen(open);
  };

  const handleCategoryToggle = (category: string) => {
    const isCurrentlySelected = stagedCategories.includes(category);
    if (isCurrentlySelected && stagedCategories.length === 1) return;
    const newCategories = isCurrentlySelected
      ? stagedCategories.filter((c) => c !== category)
      : [...stagedCategories, category];
    setStagedCategories(newCategories);
  };
  
  const currentSizeIndex = fontSizes.indexOf(stagedFontSize);

  const viewTitles: Record<View, string> = {
    main: "Settings",
    topics: "Topics",
    language: "Language",
    appearance: "Appearance",
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          {triggerIcon}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-screen h-screen sm:max-w-full p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-b-foreground/10 text-left flex-shrink-0 flex-row items-center gap-2">
          {activeView !== "main" && (
            <Button variant="ghost" size="icon" onClick={() => setActiveView("main")}>
              <ArrowLeft />
            </Button>
          )}
          <SheetTitle className="text-xl">{viewTitles[activeView]}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeView === "main" && (
            <nav className="flex flex-col gap-2">
              <button onClick={() => setActiveView("topics")} className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <LayoutGrid className="text-muted-foreground" />
                  <span className="text-lg">Topics</span>
                </div>
                <ChevronRight className="text-muted-foreground" />
              </button>
              <button onClick={() => setActiveView("language")} className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <Languages className="text-muted-foreground" />
                  <span className="text-lg">Language</span>
                </div>
                <ChevronRight className="text-muted-foreground" />
              </button>
              <button onClick={() => setActiveView("appearance")} className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <Palette className="text-muted-foreground" />
                  <span className="text-lg">Appearance</span>
                </div>
                <ChevronRight className="text-muted-foreground" />
              </button>
            </nav>
          )}

          {activeView === "topics" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => (
                  <Toggle key={category} variant="outline" pressed={stagedCategories.includes(category)} onPressedChange={() => handleCategoryToggle(category)} className="capitalize">
                    {category}
                  </Toggle>
                ))}
              </div>
              <div className="flex gap-2 pt-4 border-t">
                  <Button variant="secondary" onClick={() => setStagedCategories(availableCategories)} className="flex-1">Select All</Button>
                  <Button variant="secondary" onClick={() => setStagedCategories([availableCategories[0]])} className="flex-1">Deselect All</Button>
              </div>
            </div>
          )}

          {activeView === "language" && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 items-center gap-2">
                <Label>Content</Label>
                <Select value={stagedContentLanguage} onValueChange={setStagedContentLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 items-center gap-2">
                <Label>Translate To</Label>
                <Select value={stagedTranslationLanguage} onValueChange={setStagedTranslationLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 items-center gap-2">
                <Label>Level</Label>
                <Select value={stagedLevel} onValueChange={setStagedLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {activeView === "appearance" && (
            <div className="space-y-8">
              <AppearancePreviewCard fontSize={stagedFontSize} showImage={stagedShowImages} />
              <div className="grid gap-6">
                <div className="grid grid-cols-1 items-center gap-2">
                  <Label>Font Size</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">A</span>
                    <Slider value={[currentSizeIndex]} onValueChange={(value) => setStagedFontSize(fontSizes[value[0]])} max={fontSizes.length - 1} step={1} />
                    <span className="text-xl">A</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Images</Label>
                  <Switch checked={stagedShowImages} onCheckedChange={setStagedShowImages} />
                </div>
                <ThemeSwitcher />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}