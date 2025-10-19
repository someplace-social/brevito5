"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Skeleton } from "./ui/skeleton";
import type { TranslationData } from "@/app/api/translate-word/route";

type FactCardProps = {
  factId: string;
  language: string;
  level: string;
};

export function FactCard({ factId, language, level }: FactCardProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  // State for the translation popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // State for the translation data itself
  const [translation, setTranslation] = useState<TranslationData | null>(null);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

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
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch fact content");
          }
          const data = await response.json();
          setContent(data.content);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not load content.");
        }
      };
      fetchContent();
    }
  }, [factId, isIntersecting, language, level]);

  // Effect to handle text selection changes globally
  useEffect(() => {
    const handleSelectionChange = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        
        if (!selection || !cardRef.current || !cardRef.current.contains(selection.anchorNode)) {
          if (popoverOpen) {
            setPopoverOpen(false);
          }
          return;
        }

        const text = selection.toString().trim();
        if (text && text.length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const cardBounds = cardRef.current.getBoundingClientRect();
          
          setSelectionRect(new DOMRect(
            rect.left - cardBounds.left,
            rect.top - cardBounds.top,
            rect.width,
            rect.height
          ));
          
          if (text !== selectedText) {
            setSelectedText(text);
          }
          setPopoverOpen(true);
        } else {
          setPopoverOpen(false);
        }
      }, 50); // 50ms delay to avoid race condition with mobile OS menu
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [popoverOpen, selectedText]);

  // Effect to fetch the translation when selected text changes
  useEffect(() => {
    if (!selectedText || !popoverOpen) {
      setTranslation(null);
      return;
    }

    const fetchTranslation = async () => {
      setIsLoadingTranslation(true);
      setTranslationError(null);
      setTranslation(null);
      try {
        const response = await fetch("/api/translate-word", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word: selectedText,
            context: content,
            language,
            level,
            factId,
          }),
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Translation failed");
        }
        const data = await response.json();
        setTranslation(data.translation);
      } catch (err) {
        setTranslationError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoadingTranslation(false);
      }
    };

    fetchTranslation();
  }, [selectedText, popoverOpen, content, language, level, factId]);

  const isLoading = !content && !error;

  return (
    <div ref={ref}>
      <Card ref={cardRef} className="w-full min-h-[100px] relative">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverAnchor
            style={{
              position: 'absolute',
              top: selectionRect?.y,
              left: selectionRect?.x,
              width: selectionRect?.width,
              height: selectionRect?.height,
            }}
          />
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-[300px]" />
                <Skeleton className="h-4 w-full max-w-[250px]" />
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <p className="leading-relaxed">
                {content}
              </p>
            )}
          </CardContent>
          <PopoverContent className="w-80 p-4" side="top" align="center">
            {isLoadingTranslation && <p>Translating...</p>}
            {translationError && <p className="text-destructive">{translationError}</p>}
            {translation && (
              <div className="space-y-2">
                <p className="text-lg font-bold">{translation.primaryTranslation}</p>
                <p className="text-sm text-muted-foreground">Translated by DeepL</p>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </Card>
    </div>
  );
}