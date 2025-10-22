"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { MainView } from "./options/main-view";
import { TopicsView } from "./options/topics-view";
import { LanguageView } from "./options/language-view";
import { AppearanceView } from "./options/appearance-view";
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

const categoriesAreEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

type View = "main" | "topics" | "language" | "appearance";

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

        <div className={cn("flex-1 overflow-y-auto p-4 md:p-6", stagedFontSize)}>
          {activeView === "main" && <MainView setActiveView={setActiveView} />}
          {activeView === "topics" && <TopicsView stagedCategories={stagedCategories} setStagedCategories={setStagedCategories} />}
          {activeView === "language" && (
            <LanguageView
              stagedContentLanguage={stagedContentLanguage}
              setStagedContentLanguage={setStagedContentLanguage}
              stagedTranslationLanguage={stagedTranslationLanguage}
              setStagedTranslationLanguage={setStagedTranslationLanguage}
              stagedLevel={stagedLevel}
              setStagedLevel={setStagedLevel}
            />
          )}
          {activeView === "appearance" && (
            <AppearanceView
              stagedFontSize={stagedFontSize}
              setStagedFontSize={setStagedFontSize}
              stagedShowImages={stagedShowImages}
              setStagedShowImages={setStagedShowImages}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}