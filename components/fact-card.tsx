"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "./ui/skeleton";
import type { TranslationData } from "@/app/api/translate-word/route";
import type { WordAnalysisData } from "@/app/api/get-word-analysis/route";
import { Button } from "./ui/button";
import { WordAnalysisDrawer } from "./word-analysis-drawer";

type FactCardProps = {
  factId: string;
  language: string;
  level: string;
};

export function FactCard({ factId, language, level }: FactCardProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  const cardRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- State Management ---
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);

  const [translation, setTranslation] = useState<TranslationData | null>(null);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  
  const [analysis, setAnalysis] = useState<WordAnalysisData | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Effect to fetch the main fact content
  useEffect(() => {
    if (isIntersecting) {
      const fetchContent = async () => {
        try {
          const response = await fetch("/api/get-fact-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ factId, language, level }),
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
  }, [factId, isIntersecting, language, level]);

  // Effect to handle text selection with debouncing
  useEffect(() => {
    const handleSelectionChange = () => {
      // Clear any existing timer
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set a new timer
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
      }, 300); // Wait for 300ms of no selection activity
    };
    
    document.addEventListener("selectionchange", handleSelectionChange);
    
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [popoverOpen, selectedText]);

  // Effect to fetch the initial DeepL translation
  useEffect(() => {
    if (!selectedText || !popoverOpen) {
      setTranslation(null);
      return;
    }
    const fetchTranslation = async () => {
      setIsLoadingTranslation(true);
      setTranslationError(null);
      try {
        const response = await fetch("/api/translate-word", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: selectedText, factId, language, level }),
        });
        if (!response.ok) throw new Error("Translation failed");
        const data = await response.json();
        setTranslation(data.translation);
      } catch (err) {
        setTranslationError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoadingTranslation(false);
      }
    };
    fetchTranslation();
  }, [selectedText, popoverOpen, factId, language, level]);

  // Handler for the "Learn More" button
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
          body: JSON.stringify({ word: selectedText, language }),
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

  const isLoading = !content && !error;
  const isSingleWord = selectedText && !selectedText.includes(" ");

  return (
    <div ref={ref}>
      <Card ref={cardRef} className="w-full min-h-[100px] relative">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverAnchor style={{ position: 'absolute', top: selectionRect?.y, left: selectionRect?.x, width: selectionRect?.width, height: selectionRect?.height }} />
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-[300px]" />
                <Skeleton className="h-4 w-full max-w-[250px]" />
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <p className="leading-relaxed">{content}</p>
            )}
          </CardContent>
          <PopoverContent className="w-auto p-2" side="top" align="center">
            {isLoadingTranslation && <p className="px-2 py-1 text-sm">Translating...</p>}
            {translationError && <p className="px-2 py-1 text-sm text-destructive">{translationError}</p>}
            {translation && (
              <div className="flex items-center gap-2">
                <p className="font-semibold">{translation.primaryTranslation}</p>
                {isSingleWord && (
                  <Button variant="ghost" size="sm" className="h-auto px-2 py-1" onClick={handleLearnMore}>
                    Learn More
                  </Button>
                )}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </Card>

      <WordAnalysisDrawer
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        selectedText={selectedText}
        initialTranslation={translation?.primaryTranslation || ""}
        analysis={analysis}
        isLoading={isLoadingAnalysis}
        error={analysisError}
      />
    </div>
  );
}