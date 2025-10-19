"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "./ui/skeleton";
import type { TranslationData } from "@/app/api/translate-word/route";

// A self-contained component for a single, translatable word.
function TranslatedWord({
  word,
  context,
  language,
  level,
  factId,
}: {
  word: string;
  context: string;
  language: string;
  level: string;
  factId: string;
}) {
  const [translation, setTranslation] = useState<TranslationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    // Fetch only when the popover is opened and we don't already have a translation.
    if (open && !translation && !isLoading) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/translate-word", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word: word.replace(/[.,!?]/g, ""), // Clean punctuation
            context,
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
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <span className="cursor-pointer hover:bg-accent rounded-sm">
          {word}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side="top" align="center">
        {isLoading && <p>Translating...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {translation && (
          <div className="space-y-4">
            <p className="text-lg font-bold">{translation.primaryTranslation}</p>
            
            {translation.otherMeanings?.length > 0 && (
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Other Meanings:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {translation.otherMeanings.map((meaning, i) => (
                    <li key={i}>{meaning}</li>
                  ))}
                </ul>
              </div>
            )}

            {translation.exampleSentences?.length > 0 && (
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Examples:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {translation.exampleSentences.map((sentence, i) => (
                    <li key={i}>{sentence}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

type FactCardProps = {
  factId: string;
  language: string;
  level: string;
  loadDelay: number;
};

export function FactCard({ factId, language, level, loadDelay }: FactCardProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });
  const [wasIntersecting, setWasIntersecting] = useState(false);

  useEffect(() => {
    if (isIntersecting && !wasIntersecting) {
      setWasIntersecting(true);

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
          const errorMessage = err instanceof Error ? err.message : "Could not load content.";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      const timer = setTimeout(() => {
        fetchContent();
      }, loadDelay);

      return () => clearTimeout(timer);
    }
  }, [factId, isIntersecting, wasIntersecting, language, level, loadDelay]);

  return (
    <Card ref={ref} className="w-full min-h-[100px]">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-[300px]" />
            <Skeleton className="h-4 w-full max-w-[250px]" />
          </div>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          content && (
            <p className="leading-relaxed">
              {content.split(/(\s+)/).map((segment, index) => {
                if (/\s+/.test(segment) || segment === "") {
                  return <span key={index}>{segment}</span>;
                }
                return (
                  <TranslatedWord
                    key={index}
                    word={segment}
                    context={content}
                    language={language}
                    level={level}
                    factId={factId}
                  />
                );
              })}
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
}