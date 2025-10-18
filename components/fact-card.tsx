"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export function FactCard({ factId }: { factId: string }) {
  const [content, setContent] = useState(" ");
  const [error, setError] = useState("");
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });
  const [wasIntersecting, setWasIntersecting] = useState(false);

  useEffect(() => {
    if (isIntersecting && !wasIntersecting) {
      setWasIntersecting(true); // Ensure fetch only happens once
      setContent("Loading...");

      const fetchContent = async () => {
        try {
          const response = await fetch("/api/get-fact-content", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              factId,
              language: "English", // Placeholder
              level: "Beginner", // Placeholder
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch fact content");
          }

          const data = await response.json();
          setContent(data.content);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
          setContent("Could not load content.");
        }
      };

      fetchContent();
    }
  }, [factId, isIntersecting, wasIntersecting]);

  return (
    <Card ref={ref} className="w-full min-h-[100px]">
      <CardContent className="p-6">
        <p>{content}</p>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}