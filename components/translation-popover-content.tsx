"use client";

import { useEffect, useState } from "react";
import type { TranslationData } from "@/app/api/translate-word/route";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type TranslationPopoverContentProps = {
  popoverOpen: boolean;
  selectedText: string;
  factId: string;
  level: string;
  contentLanguage: string;
  translationLanguage: string;
  baseFontSize: string;
  onLearnMore: () => void;
};

export function TranslationPopoverContent({
  popoverOpen,
  selectedText,
  factId,
  level,
  contentLanguage,
  translationLanguage,
  baseFontSize,
  onLearnMore,
}: TranslationPopoverContentProps) {
  const [translation, setTranslation] = useState<TranslationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedText || !popoverOpen) {
      setTranslation(null);
      return;
    }

    const fetchTranslation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/translate-word", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word: selectedText,
            factId,
            level,
            sourceLanguage: contentLanguage,
            targetLanguage: translationLanguage,
          }),
        });
        if (!response.ok) throw new Error("Translation failed");
        const data = await response.json();
        setTranslation(data.translation);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, [selectedText, popoverOpen, factId, contentLanguage, translationLanguage, level]);

  const getTranslationFontSize = (baseSize: string) => {
    const sizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];
    const currentIndex = sizes.indexOf(baseSize);
    if (currentIndex === -1 || currentIndex >= sizes.length - 1) {
      return "text-3xl";
    }
    return sizes[currentIndex + 1];
  };

  const isSingleWord = selectedText && !selectedText.includes(" ");
  const translationFontSize = getTranslationFontSize(baseFontSize);

  if (isLoading) {
    return <p className="px-3 py-2 text-sm">Translating...</p>;
  }

  if (error) {
    return <p className="px-3 py-2 text-sm text-destructive">{error}</p>;
  }

  if (translation) {
    return (
      <div className="flex flex-col">
        <p className={cn("font-semibold px-3 py-2 break-words", translationFontSize)}>
          {translation.primaryTranslation}
        </p>
        {isSingleWord && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-auto px-3 py-2 text-sm rounded-t-none border-t border-foreground/10"
            onClick={onLearnMore}
          >
            Learn More
          </Button>
        )}
      </div>
    );
  }

  return null;
}