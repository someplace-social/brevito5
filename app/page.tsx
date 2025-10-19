"use client";

import { FactCard } from "@/components/fact-card";
import { OptionsMenu } from "@/components/options-menu";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect, useState, useCallback } from "react";

type Fact = {
  id: string;
};

const PAGE_LIMIT = 5;

export default function Home() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("Spanish");
  const [level, setLevel] = useState("Beginner");
  
  // State to trigger fetching
  const [page, setPage] = useState(0);
  const [settingsKey, setSettingsKey] = useState(0);

  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 1.0 });

  // This is now the single source of truth for fetching data.
  // It runs whenever the page number or settings change.
  useEffect(() => {
    // Guard against fetching if we're already loading or if there's nothing left to fetch.
    if (isLoading || !hasMore) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(
          `/api/get-facts?page=${page}&limit=${PAGE_LIMIT}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch facts");
        }
        const newFacts = await response.json();

        if (newFacts.length < PAGE_LIMIT) {
          setHasMore(false);
        }

        // If it's the first page (initial load or settings change), replace the facts.
        // Otherwise, append the new facts to the existing list.
        setFacts((prevFacts) => (page === 0 ? newFacts : [...prevFacts, ...newFacts]));

      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, settingsKey]); // We intentionally omit other dependencies to control the fetch trigger precisely.

  // This effect handles the infinite scroll trigger.
  useEffect(() => {
    // When the sentinel div is visible and we have more items, increment the page to trigger the fetch effect.
    if (isIntersecting && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isIntersecting, hasMore, isLoading]);

  // This function now only resets state. It doesn't trigger a fetch directly.
  const handleSettingsChange = useCallback(
    (newLanguage: string, newLevel: string) => {
      setLanguage(newLanguage);
      setLevel(newLevel);
      setFacts([]);
      setPage(0);
      setHasMore(true);
      setSettingsKey((prevKey) => prevKey + 1); // This change will trigger the main fetch effect.
    },
    [],
  );

  return (
    <main className="flex flex-col items-center min-h-screen">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="w-full max-w-2xl flex items-center justify-between p-3 px-5">
          <div className="text-sm font-semibold">Brevito</div>
          <OptionsMenu onSettingsChange={handleSettingsChange} />
        </div>
      </nav>
      <div className="flex-1 w-full flex flex-col items-center p-4">
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {facts.map((fact, index) => (
            <FactCard
              key={`${fact.id}-${settingsKey}`}
              factId={fact.id}
              language={language}
              level={level}
              loadDelay={index * 200} // Stagger each card's load by 200ms
            />
          ))}

          {/* Sentinel for infinite scroll, only rendered when there are more facts and we are not currently loading */}
          {hasMore && !isLoading && <div ref={ref} className="h-1" />}

          {isLoading && (
            <p className="text-center text-muted-foreground py-4">Loading...</p>
          )}
          {error && <p className="text-center text-red-500 py-4">{error}</p>}
          {!hasMore && facts.length > 0 && (
            <p className="text-center text-muted-foreground py-4">
              You&apos;ve reached the end!
            </p>
          )}
        </div>
      </div>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
        <p>Built with Next.js and Supabase</p>
      </footer>
    </main>
  );
}