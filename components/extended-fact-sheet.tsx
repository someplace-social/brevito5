"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTextSelection } from "@/hooks/use-text-selection";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { TranslationPopoverContent } from "./translation-popover-content";
import { WordAnalysisDrawer } from "./word-analysis-drawer";
import type { WordAnalysisData } from "@/app/api/get-word-analysis/route";

type ExtendedFactData = {
  content: string | null;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
  category: string | null;
  subcategory: string | null;
};

type ExtendedFactSheetProps = {
  factId: string | null;
  language: string;
  translationLanguage: string;
  level: string;
  fontSize: string;
  showImages: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function ExtendedFactSheet({
  factId,
  language,
  translationLanguage,
  level,
  fontSize,
  showImages,
  isOpen,
  onOpenChange,
}: ExtendedFactSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ExtendedFactData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { popoverOpen, setPopoverOpen, selectedText, selectionRect } = useTextSelection(contentRef);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analysis, setAnalysis] = useState<WordAnalysisData | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    setAnalysis(null);
  }, [selectedText]);

  useEffect(() => {
    if (isOpen && factId) {
      const fetchExtendedContent = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch("/api/get-extended-fact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ factId, language, level }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch extended content");
          }
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
          setIsLoading(false);
        }
      };
      fetchExtendedContent();
    } else {
      setData(null);
      setError(null);
      setIsLoading(true);
    }
  }, [factId, isOpen, language, level]);

  const handleLearnMore = async () => {
    setPopoverOpen(false);
    setDrawerOpen(true);

    if (!analysis) {
      setIsLoadingAnalysis(true);
      setAnalysisError(null);
      try {
        const response = await fetch("/api/get-word-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            word: selectedText, 
            sourceLanguage: language,
            targetLanguage: translationLanguage 
          }),
        });
        if (!response.ok) throw new Error("Analysis failed");
        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (err) {
        setAnalysisError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoadingAnalysis(false);
      }
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-screen h-screen sm:max-w-full p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-b-foreground/10 text-left flex-shrink-0 flex flex-row items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <ArrowLeft />
            </Button>
            <SheetTitle className={cn(fontSize)}>Details</SheetTitle>
            <SheetDescription className="sr-only">
              More detailed information about the selected fact.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={contentRef}>
            <div className="max-w-2xl mx-auto relative">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverAnchor style={{ position: 'absolute', top: selectionRect?.y, left: selectionRect?.x, width: selectionRect?.width, height: selectionRect?.height }} />
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : error ? (
                  <p className="text-center text-destructive py-4">{error}</p>
                ) : data ? (
                  <article className="space-y-6">
                    {showImages && data.image_url && (
                      <div className="relative w-full aspect-[16/9] bg-muted rounded-lg overflow-hidden">
                        {isImageLoading && <Skeleton className="w-full h-full" />}
                        <Image
                          src={data.image_url}
                          alt={data.category || 'Fact image'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={cn("object-cover transition-opacity duration-300", isImageLoading ? "opacity-0" : "opacity-100")}
                          onLoad={() => setIsImageLoading(false)}
                        />
                      </div>
                    )}
                    {data.category && (
                      <div className={cn("font-heading font-semibold uppercase tracking-wider text-muted-foreground", fontSize)}>
                        {data.category}
                        {data.subcategory && <span> &gt; {data.subcategory}</span>}
                      </div>
                    )}
                    <p className={`leading-relaxed ${fontSize} [-webkit-touch-callout:none]`} onContextMenu={(e) => e.preventDefault()}>{data.content}</p>
                    {data.source && data.source_url && (
                      <div className={cn("text-muted-foreground pt-4 border-t", fontSize)}>
                        <a href={data.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                          Source: {data.source}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </article>
                ) : null}
                <PopoverContent className="w-fit max-w-sm p-0 translate-z-0 bg-background text-foreground" side="top" align="center">
                  <TranslationPopoverContent
                    popoverOpen={popoverOpen}
                    selectedText={selectedText}
                    contentLanguage={language}
                    translationLanguage={translationLanguage}
                    baseFontSize={fontSize}
                    contextText={data?.content || null}
                    onLearnMore={handleLearnMore}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <WordAnalysisDrawer
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        selectedText={selectedText}
        analysis={analysis}
        isLoading={isLoadingAnalysis}
        error={analysisError}
        fontSize={fontSize}
      />
    </>
  );
}