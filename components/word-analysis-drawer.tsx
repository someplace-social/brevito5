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

type WordAnalysisDrawerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedText: string;
  initialTranslation: string;
  analysis: WordAnalysisData | null;
  isLoading: boolean;
  error: string | null;
};

export function WordAnalysisDrawer({
  isOpen,
  onOpenChange,
  selectedText,
  initialTranslation,
  analysis,
  isLoading,
  error,
}: WordAnalysisDrawerProps) {
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
            <div className="space-y-6 text-sm">
              {analysis.rootWord && selectedText.toLowerCase() !== analysis.rootWord.toLowerCase() && (
                <div>
                  <h3 className="font-semibold text-muted-foreground mb-1">ROOT WORD</h3>
                  <p className="italic">{analysis.rootWord}</p>
                </div>
              )}
              {analysis.otherMeanings && analysis.otherMeanings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-muted-foreground mb-2">OTHER MEANINGS</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.otherMeanings.map((meaning, i) => (
                      <li key={i}>{meaning}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.exampleSentences && analysis.exampleSentences.length > 0 && (
                <div>
                  <h3 className="font-semibold text-muted-foreground mb-2">EXAMPLES</h3>
                  <ul className="list-disc list-inside space-y-1 italic text-muted-foreground">
                    {analysis.exampleSentences.map((sentence, i) => (
                      <li key={i}>{sentence}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}