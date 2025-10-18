"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FactCardProps = {
  factId: string;
  language: string;
  level: string;
};

export function FactCard({ factId, language, level }: FactCardProps) {
  const [content, setContent] = useState(" ");
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });
  const [wasIntersecting, setWasIntersecting] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<EventTarget | null>(null);

  useEffect(() => {
    if (isIntersecting && !wasIntersecting) {
      setWasIntersecting(true);
      setContent("Loading...");

      const fetchContent = async () => {
        try {
          const response = await fetch("/api/get-fact-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ factId, language, level }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch fact content");
          }

          const data = await response.json();
          setContent(data.content);
        } catch {
          setContent("Could not load content.");
        }
      };

      fetchContent();
    }
  }, [factId, isIntersecting, wasIntersecting, language, level]);

  const handleWordClick = async (e: React.MouseEvent<HTMLSpanElement>) => {
    const word = (e.target as HTMLElement).innerText.replace(/[.,!?]/g, "");
    if (!word) return;

    setCurrentTarget(e.currentTarget);
    setPopoverOpen(true);
    setTranslation("Translating...");

    try {
      const response = await fetch("/api/translate-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word,
          context: content,
          language,
          level,
          factId,
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      setTranslation(data.translation);
    } catch {
      setTranslation("Error");
    }
  };

  const renderContent = () => {
    if (content === " " || content === "Loading...") {
      return <p>{content}</p>;
    }

    return (
      <p>
        {content.split(/(\s+)/).map((segment, index) =>
          /\s+/.test(segment) ? (
            <span key={index}>{segment}</span>
          ) : (
            <span
              key={index}
              className="cursor-pointer hover:bg-accent rounded-sm"
              onClick={handleWordClick}
            >
              {segment}
            </span>
          ),
        )}
      </p>
    );
  };

  return (
    <Card ref={ref} className="w-full min-h-[100px]">
      <CardContent className="p-6">
        <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>{renderContent()}</PopoverTrigger>
          {currentTarget && (
            <PopoverContent
              className="w-auto"
              onOpenAutoFocus={(e) => e.preventDefault()}
              align="center"
              side="top"
              // This is a trick to anchor the popover to the clicked word
              style={{
                position: "absolute",
                left: `${(currentTarget as HTMLElement).offsetLeft}px`,
                top: `${(currentTarget as HTMLElement).offsetTop - 40}px`,
              }}
            >
              {translation}
            </PopoverContent>
          )}
        </Popover>
      </CardContent>
    </Card>
  );
}