"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "./ui/skeleton";
import type { WordAnalysisData } from "@/app/api/get-word-analysis/route";
import { WordAnalysisDrawer } from "./word-analysis-drawer";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslationPopoverContent } from "./translation-popover-content";
import { useFactContent } from "@/hooks/use-fact-content";
import { useTextSelection } from "@/hooks/use-text-selection";

type FactCardProps = {
  factId: string;
  contentLanguage: string;
  translationLanguage: string;
  level: string;
  fontSize: string;
  category: string | null;
  subcategory: string | null;
  source: string | null;
  sourceUrl: string | null;
  imageUrl: string | null;
  showImages: boolean;
  onCategoryFilter: (category: string) => void;
};

export function FactCard({ factId, contentLanguage, translationLanguage, level, fontSize, category, subcategory, source, sourceUrl, imageUrl, showImages, onCategoryFilter }: FactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { content, error: contentError, isLoading: isLoadingContent } = useFactContent({ factId, language: contentLanguage, level, isIntersecting });
  const { popoverOpen, setPopoverOpen, selectedText, selectionRect } = useTextSelection(cardRef);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [analysis, setAnalysis] = useState<WordAnalysisData | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [primaryTranslation, setPrimaryTranslation] = useState("");

  const handleLearnMore = async () => {
    // Fetch the primary translation before opening the drawer
    try {
      const response = await fetch("/api/translate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: selectedText, factId, level,
          sourceLanguage: contentLanguage, 
          targetLanguage: translationLanguage 
        }),
      });
      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      setPrimaryTranslation(data.translation?.primaryTranslation || "");
    } catch (err) {
      console.error(err);
      setPrimaryTranslation("");
    }

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
            sourceLanguage: contentLanguage,
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
    <div ref={intersectionRef}>
      <Card ref={cardRef} className="w-full min-h-[100px] relative flex flex-col overflow-hidden">
        {showImages && imageUrl && (
          <div className="relative w-full aspect-[16/9] bg-muted">
            {isImageLoading && <Skeleton className="w-full h-full" />}
            <Image
              src={imageUrl}
              alt={content || category || 'Fact image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn("object-cover transition-opacity duration-300", isImageLoading ? "opacity-0" : "opacity-100")}
              onLoad={() => setIsImageLoading(false)}
            />
          </div>
        )}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverAnchor style={{ position: 'absolute', top: selectionRect?.y, left: selectionRect?.x, width: selectionRect?.width, height: selectionRect?.height }} />
          <CardContent className="p-6 flex-grow">
            {isLoadingContent ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full max-w-[300px]" />
                <Skeleton className="h-4 w-full max-w-[250px]" />
              </div>
            ) : contentError ? (
              <p className="text-destructive">{contentError}</p>
            ) : (
              <>
                {category && (
                  <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <button onClick={() => onCategoryFilter(category)} className="hover:text-foreground transition-colors">{category}</button>
                    {subcategory && (
                      <>
                        <span> &gt; </span>
                        <button onClick={() => onCategoryFilter(category)} className="hover:text-foreground transition-colors">{subcategory}</button>
                      </>
                    )}
                  </div>
                )}
                <p className={`leading-relaxed ${fontSize}`} onContextMenu={(e) => e.preventDefault()}>{content}</p>
              </>
            )}
          </CardContent>

          {source && sourceUrl && (
            <div className="px-6 pb-4 text-xs text-muted-foreground">
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                Source: {source}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          )}

          <PopoverContent className="w-fit max-w-sm p-0 translate-z-0 bg-background text-foreground" side="top" align="center">
            <TranslationPopoverContent
              popoverOpen={popoverOpen}
              selectedText={selectedText}
              factId={factId}
              level={level}
              contentLanguage={contentLanguage}
              translationLanguage={translationLanguage}
              baseFontSize={fontSize}
              onLearnMore={handleLearnMore}
            />
          </PopoverContent>
        </Popover>
      </Card>

      <WordAnalysisDrawer
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        selectedText={selectedText}
        initialTranslation={primaryTranslation}
        analysis={analysis}
        isLoading={isLoadingAnalysis}
        error={analysisError}
        fontSize={fontSize}
      />
    </div>
  );
}