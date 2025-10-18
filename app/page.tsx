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
  const [settingsKey, setSettingsKey] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 1.0 });

  const loadMoreFacts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
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
      setFacts((prevFacts) => [...prevFacts, ...newFacts]);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading]);

  useEffect(() => {
    loadMoreFacts();
  }, []); // Initial load

  useEffect(() => {
    if (isIntersecting && hasMore) {
      loadMoreFacts();
    }
  }, [isIntersecting, hasMore, loadMoreFacts]);

  const handleSettingsChange = (newLanguage: string, newLevel: string) => {
    setLanguage(newLanguage);
    setLevel(newLevel);
    // Reset facts and pagination when settings change
    setFacts([]);
    setPage(0);
    setHasMore(true);
    setSettingsKey((prevKey) => prevKey + 1);
  };
  
  // Effect to reload facts when settings change
  useEffect(() => {
    if (settingsKey > 0) { // a change has happened
        loadMoreFacts();
    }
  }, [settingsKey]);


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
          {facts.map((fact) => (
            <FactCard
              key={`${fact.id}-${settingsKey}`}
              factId={fact.id}
              language={language}
              level={level}
            />
          ))}
          {isLoading && <p>Loading more facts...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!hasMore && facts.length > 0 && (
            <p className="text-center text-muted-foreground py-4">
              You&apos;ve reached the end!
            </p>
          )}
          <div ref={ref} />
        </div>
      </div>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
        <p>Built with Next.js and Supabase</p>
      </footer>
    </main>
  );
}