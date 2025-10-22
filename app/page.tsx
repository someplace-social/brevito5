"use client";

import { FactCard } from "@/components/fact-card";
import { OptionsMenu } from "@/components/options-menu";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useEffect, useState, useCallback } from "react";

type Fact = {
  id: string;
  category: string | null;
  subcategory: string | null;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
};

const PAGE_LIMIT = 5;

export default function Home() {
  const {
    isInitialized,
    settingsKey,
    contentLanguage, setContentLanguage,
    translationLanguage, setTranslationLanguage,
    level, setLevel,
    fontSize, setFontSize,
    selectedCategories, setSelectedCategories,
    showImages, setShowImages,
  } = useAppSettings();

  const [facts, setFacts] = useState<Fact[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 1.0 });

  // Reset feed when settings change
  useEffect(() => {
    if (!isInitialized) return;
    setFacts([]);
    setPage(0);
    setHasMore(true);
  }, [settingsKey, isInitialized]);

  const fetchFacts = useCallback(async () => {
    if (!hasMore) return;
    setIsLoading(true);
    setError("");
    try {
      const categoriesQuery = selectedCategories.join(',');
      const response = await fetch(
        `/api/get-facts?page=${page}&limit=${PAGE_LIMIT}&categories=${categoriesQuery}&language=${contentLanguage}`,
      );
      if (!response.ok) throw new Error("Failed to fetch facts");
      const newFacts: Fact[] = await response.json();

      if (newFacts.length < PAGE_LIMIT) {
        setHasMore(false);
      }

      setFacts((prevFacts) => {
        const combinedFacts = [...prevFacts, ...newFacts];
        const uniqueFactsMap = new Map(combinedFacts.map((fact: Fact) => [fact.id, fact]));
        return Array.from(uniqueFactsMap.values());
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedCategories, contentLanguage, hasMore]);


  useEffect(() => {
    if (isInitialized) {
      fetchFacts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, settingsKey, isInitialized]);


  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isIntersecting, hasMore, isLoading]);

  const handleCategoryFilter = (category: string) => {
    const isAlreadyFiltered = selectedCategories.length === 1 && selectedCategories[0] === category;
    
    if (category && !isAlreadyFiltered) {
      setSelectedCategories([category]);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen">
      <header className="w-full flex justify-center border-b border-b-foreground/10 sticky top-0 bg-background/95 backdrop-blur-sm z-10 p-4">
        <div className="w-full max-w-2xl relative flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Brevito</h1>
            <p className="text-sm text-muted-foreground">
              Learn while you doomscroll
            </p>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
            <OptionsMenu 
              contentLanguage={contentLanguage}
              onContentLanguageChange={setContentLanguage}
              translationLanguage={translationLanguage}
              onTranslationLanguageChange={setTranslationLanguage}
              level={level}
              onLevelChange={setLevel}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              selectedCategories={selectedCategories}
              onSelectedCategoriesChange={setSelectedCategories}
              showImages={showImages}
              onShowImagesChange={setShowImages}
            />
          </div>
        </div>
      </header>
      <div className="flex-1 w-full flex flex-col items-center p-4">
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {facts.map((fact) => (
            <FactCard
              key={`${fact.id}-${settingsKey}`}
              factId={fact.id}
              contentLanguage={contentLanguage}
              translationLanguage={translationLanguage}
              level={level}
              fontSize={fontSize}
              category={fact.category}
              subcategory={fact.subcategory}
              source={fact.source}
              sourceUrl={fact.source_url}
              imageUrl={fact.image_url}
              showImages={showImages}
              onCategoryFilter={handleCategoryFilter}
            />
          ))}

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
    </main>
  );
}