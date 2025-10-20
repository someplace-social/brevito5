"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { WordAnalysisData } from "@/app/api/get-word-analysis/route";
import { Skeleton } from "./ui/skeleton";
import React from "react";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

// Helper component to render sentences with the selected word underlined
const UnderlinedSentence = ({ sentence, word }: { sentence: string; word: string }) => {
  if (!word) return <>{sentence}</>;
  
  // Create a case-insensitive regular expression to split the sentence
  const parts = sentence.split(new RegExp(`(${word})`, 'gi'));
  
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === word.toLowerCase() ? (
          <u key={index}>{part}</u>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

type WordAnalysisDrawerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedText: string;
  initialTranslation: string;
  analysis: WordAnalysisData | null;
  isLoading: boolean;
  error: string | null;
  fontSize: string;
};

export function WordAnalysisDrawer({
  isOpen,
  onOpenChange,
  selectedText,
  initialTranslation,
  analysis,
  isLoading,
  error,
  fontSize,
}: WordAnalysisDrawerProps) {
  // Combine the initial translation with other meanings for a unified list
  const allMeanings = analysis?.otherMeanings
    ? [initialTranslation, ...analysis.otherMeanings]
    : [initialTranslation];

  // Remove duplicates AND any empty/falsy values to prevent blank bullets
  const uniqueMeanings = [...new Set(allMeanings)].filter(Boolean);

  const spanishDictUrl = `https://www.spanishdict.com/translate/${encodeURIComponent(selectedText)}`;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-lg">
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl">{selectedText}</SheetTitle>
          <SheetDescription className="text-lg">{initialTranslation}</SheetDescription>
        </SheetHeader>
        <div className="py-6">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {analysis && (
            <div className="space-y-6">
              {analysis.rootWord && selectedText.toLowerCase() !== analysis.rootWord.toLowerCase() && (
                <div>
                  <h3 className="font-semibold text-muted-foreground mb-1">ROOT</h3>
                  <p className={`italic ${fontSize}`}>{analysis.rootWord}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-muted-foreground mb-2">MEANINGS</h3>
                <ul className={`list-disc list-inside space-y-1 ${fontSize}`}>
                  {uniqueMeanings.map((meaning, i) => (
                    <li key={i}>{meaning}</li>
                  ))}
                </ul>
              </div>

              {analysis.exampleSentences && analysis.exampleSentences.length > 0 && (
                <div>
                  <h3 className="font-semibold text-muted-foreground mb-2">EXAMPLES</h3>
                  <ul className={`list-disc list-inside space-y-1 italic text-muted-foreground ${fontSize}`}>
                    {analysis.exampleSentences.map((sentence, i) => (
                      <li key={i}>
                        <UnderlinedSentence sentence={sentence} word={selectedText} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border-t pt-4">
          <Button variant="ghost" className="w-full justify-between" asChild>
            <a href={spanishDictUrl} target="_blank" rel="noopener noreferrer">
              Learn Even More
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 