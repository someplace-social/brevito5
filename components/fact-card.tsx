"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function FactCard({ factId }: { factId: string }) {
  const [content, setContent] = useState("Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, [factId]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <p>{content}</p>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}