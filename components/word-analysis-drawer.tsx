"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { WordAnalysisData } from "@/app/api/get-word-analysis/route";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// Helper component to render sentences with the selected word underlined
const UnderlinedSentence = ({ sentence, word }: { sentence: string; word: string }) => {
  if (!word || !sentence) return <>{sentence}</>;
  
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
      <SheetContent side="bottom" className="rounded-t-lg max-h-[90vh] flex flex-col">
        <SheetHeader className="text-left flex-shrink-0">
          <SheetTitle className={cn("text-3xl capitalize", fontSize)}>{selectedText}</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex-1 overflow-y-auto">
          {isLoading && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full mt-2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full mt-2" />
              </div>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {analysis && (
            <div className="space-y-8">
              {analysis.rootWord && selectedText.toLowerCase() !== analysis.rootWord.toLowerCase() && (
                <div className="pb-4 border-b">
                  <h3 className="font-semibold text-muted-foreground text-sm tracking-wider uppercase">ROOT</h3>
                  <p className={cn("italic text-lg", fontSize)}>{analysis.rootWord}</p>
                </div>
              )}
              
              {analysis.analysis?.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className={cn("text-2xl font-semibold", fontSize)}>{item.translation}</h3>
                  <p className="text-sm text-muted-foreground italic capitalize">{item.partOfSpeech}</p>
                  <blockquote className="mt-2 pl-4 border-l-2 border-primary/20">
                    <p className={cn("italic", fontSize)}>
                      <UnderlinedSentence sentence={item.exampleSentence} word={selectedText} />
                    </p>
                    <p className={cn("text-muted-foreground", fontSize)}>{item.exampleTranslation}</p>
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t pt-4 flex-shrink-0">
          <Button variant="ghost" className={cn("w-full justify-between", fontSize)} asChild>
            <a href={spanishDictUrl} target="_blank" rel="noopener noreferrer">
              View on SpanishDict
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}