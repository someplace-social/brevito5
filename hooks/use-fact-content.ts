"use client";

import { useState, useEffect } from "react";

type UseFactContentProps = {
  factId: string;
  language: string;
  level: string;
  isIntersecting: boolean;
};

export function useFactContent({ factId, language, level, isIntersecting }: UseFactContentProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isIntersecting && !content) {
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
  }, [factId, isIntersecting, language, level, content]);

  const isLoading = !content && !error;

  return { content, error, isLoading };
}