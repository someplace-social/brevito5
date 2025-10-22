"use client";

import { useEffect, useState, useRef } from "react";
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
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  const cardRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  
  const [analysis, setAnalysis] = useState<WordAnalysisData | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [primaryTranslation, setPrimaryTranslation] = useState("");

  useEffect(() => {
    if (isIntersecting) {
      const fetchContent = async () => {
        try {
          const response = await fetch("/api/get-fact-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ factId, language: contentLanguage, level }),
          });
          if (!response.ok) throw new Error("Failed to fetch fact content");
          const data = await response.json();
          setContent(data.content);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not load content.");
        }
      };
      fetchContent();
    }
  }, [factId, isIntersecting, contentLanguage, level]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || !cardRef.current || !cardRef.current.contains(selection.anchorNode)) {
          if (popoverOpen) setPopoverOpen(false);
          return;
        }
        const text = selection.toString().trim();
        if (text && text.length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const cardBounds = cardRef.current.getBoundingClientRect();
          setSelectionRect(new DOMRect(rect.left - cardBounds.left, rect.top - cardBounds.top, rect.width, rect.height));
          if (text !== selectedText) {
            setSelectedText(text);
            setAnalysis(null);
          }
          setPopoverOpen(true);
        } else {
          setPopoverOpen(false);
        }
      }, 300);
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [popoverOpen, selectedText]);

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
      // Handle error if needed, maybe show a toast
      console.error(err);
      setPrimaryTranslation(""); // Clear previous translation on error
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

  const isLoadingContent = !content && !error;

  return (
    <div ref={ref}>
      <Card ref={cardRef} className="w-full min-h-[100px] relative flex flex-col overflow-hidden">
        {showImages && imageUrl && (
          <div className="relative w-full aspect-[16/9] bg-muted">
            {isImageLoading && <Skeleton className="w-full h-full" />}
            <Image
              src={imageUrl}
              alt={content || category || 'Fact image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover transition-opacity duration-300",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
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
            ) : error ? (
              <p className="text-destructive">{error}</p>
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
                <p 
                  className={`leading-relaxed ${fontSize}`}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {content}
                </p>
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

          <PopoverContent 
            className="w-fit max-w-sm p-0 translate-z-0 bg-background text-foreground" 
            side="top" 
            align="center"
          >
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