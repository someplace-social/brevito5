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
  const [translation, setTranslation] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    // Fetch only when the popover is opened and we don't already have a translation.
    if (open && !translation) {
      setTranslation("Translating...");
      try {
        const response = await fetch("/api/translate-word", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word: word.replace(/[.,!?]/g, ""), // Clean punctuation from the word
            context,
            language,
            level,
            factId,
          }),
        });
        if (!response.ok) throw new Error("Translation failed");
        const data = await response.json();
        setTranslation(data.translation);
      } catch {
        setTranslation("Error");
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
      <PopoverContent className="w-auto p-2" side="top" align="center">
        {translation}
      </PopoverContent>
    </Popover>
  );
}

type FactCardProps = {
  factId: string;
  language: string;
  level: string;
  loadDelay: number; // New prop for staggering requests
};

export function FactCard({ factId, language, level, loadDelay }: FactCardProps) {
  const [content, setContent] = useState<string | null>(null);
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
            // Use the error message from the backend if available
            throw new Error(errorData.error || "Failed to fetch fact content");
          }

          const data = await response.json();
          setContent(data.content);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Could not load content.";
          setContent(errorMessage);
        }
      };

      // Delay the fetch to avoid hitting rate limits
      const timer = setTimeout(() => {
        fetchContent();
      }, loadDelay);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [factId, isIntersecting, wasIntersecting, language, level, loadDelay]);

  return (
    <Card ref={ref} className="w-full min-h-[100px]">
      <CardContent className="p-6">
        {content === null ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-[300px]" />
            <Skeleton className="h-4 w-full max-w-[250px]" />
          </div>
        ) : (
          <p className="leading-relaxed">
            {/* Split the content into words and whitespace to make each word interactive */}
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
        )}
      </CardContent>
    </Card>
  );
}