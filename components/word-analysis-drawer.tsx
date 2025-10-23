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
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type WordAnalysisDrawerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedText: string;
  analysis: WordAnalysisData | null;
  isLoading: boolean;
  error: string | null;
  fontSize: string;
};

export function WordAnalysisDrawer({
  isOpen,
  onOpenChange,
  selectedText,
  analysis,
  isLoading,
  error,
  fontSize,
}: WordAnalysisDrawerProps) {
  const spanishDictUrl = `https://www.spanishdict.com/translate/${encodeURIComponent(selectedText)}`;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-lg max-h-[80vh] flex flex-col">
        <SheetHeader className="text-left flex-shrink-0">
          <SheetTitle className={cn("text-2xl", fontSize)}>{selectedText}</SheetTitle>
          <SheetDescription className={cn("text-lg", fontSize)}>
            {isLoading ? "..." : analysis?.primaryTranslation}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 flex-1 overflow-y-auto">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {analysis && (
            <div className="space-y-6">
              {analysis.partOfSpeech && (
                <div>
                  <h3 className="font-semibold text-muted-foreground uppercase text-sm tracking-wider mb-1">
                    Part of Speech
                  </h3>
                  <p className={cn("capitalize", fontSize)}>{analysis.partOfSpeech}</p>
                </div>
              )}
              
              {analysis.meanings?.length > 0 && (
                <div className="space-y-4">
                  {analysis.meanings.map((item, index) => (
                    <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                      <h3 className={cn("font-semibold", fontSize)}>{item.meaning}</h3>
                      <div className={cn("italic text-muted-foreground mt-1 space-y-1", fontSize)}>
                        <p>&quot;{item.exampleSpanish}&quot;</p>
                        <p>{item.exampleEnglish}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border-t pt-4 flex-shrink-0">
          <Button variant="ghost" className={cn("w-full justify-between", fontSize)} asChild>
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