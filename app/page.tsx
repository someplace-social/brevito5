"use client";

import { FactCard } from "@/components/fact-card";
import { OptionsMenu } from "@/components/options-menu";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect, useState, useCallback } from "react";

type Fact = {
  id: string;
  category: string | null;
  subcategory: string | null;
};

const PAGE_LIMIT = 5;
const availableCategories = ["Science", "History", "Geography"];
const fontSizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];

export default function Home() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [error, setError] = useState("");
  
  // All settings state is managed here
  const [contentLanguage, setContentLanguage] = useState("Spanish");
  const [translationLanguage, setTranslationLanguage] = useState("English");
  const [level, setLevel] = useState("Beginner");
  const [fontSize, setFontSize] = useState("text-lg");
  const [selectedCategories, setSelectedCategories] = useState(availableCategories);
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // New state to control initialization and resets
  const [isInitialized, setIsInitialized] = useState(false);
  const [settingsKey, setSettingsKey] = useState(0);

  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 1.0 });

  // Effect 1: Load settings from localStorage ONLY ONCE on initial mount
  useEffect(() => {
    const savedContentLang = localStorage.getItem("brevito-content-language");
    const savedTranslationLang = localStorage.getItem("brevito-translation-language");
    const savedLevel = localStorage.getItem("brevito-level");
    const savedFontSize = localStorage.getItem("brevito-font-size");
    const savedCategories = localStorage.getItem("brevito-categories");

    if (savedContentLang) setContentLanguage(savedContentLang);
    if (savedTranslationLang) setTranslationLanguage(savedTranslationLang);
    if (savedLevel) setLevel(savedLevel);
    if (savedFontSize && fontSizes.includes(savedFontSize)) setFontSize(savedFontSize);
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
          setSelectedCategories(parsedCategories);
        }
      } catch (e) {
        // Ignore malformed JSON in localStorage
      }
    }

    // Mark initialization as complete to allow data fetching
    setIsInitialized(true);
  }, []);

  // Effect 2: Main data fetching logic.
  // Runs when initialized, when page changes, or when settingsKey changes.
  useEffect(() => {
    // Don't fetch until settings are loaded from localStorage
    if (!isInitialized) return;

    const fetchData = async () => {
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
          // If it's the first page, replace facts. Otherwise, append.
          const combinedFacts = page === 0 ? newFacts : [...prevFacts, ...newFacts];
          const uniqueFactsMap = new Map(combinedFacts.map((fact: Fact) => [fact.id, fact]));
          return Array.from(uniqueFactsMap.values());
        });

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
  }, [page, settingsKey, isInitialized]);

  // Effect 3: Infinite scroll trigger
  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isIntersecting, hasMore, isLoading]);

  // Callback for when any setting is changed in the OptionsMenu
  const handleSettingsChange = useCallback(() => {
    setFacts([]);
    setPage(0);
    setHasMore(true);
    setSettingsKey(prevKey => prevKey + 1);

    localStorage.setItem("brevito-content-language", contentLanguage);
    localStorage.setItem("brevito-translation-language", translationLanguage);
    localStorage.setItem("brevito-level", level);
    localStorage.setItem("brevito-font-size", fontSize);
    localStorage.setItem("brevito-categories", JSON.stringify(selectedCategories));
  }, [contentLanguage, translationLanguage, level, fontSize, selectedCategories]);

  // Effect to trigger a reset ONLY when a setting actually changes
  useEffect(() => {
    if (!isInitialized) return;
    handleSettingsChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLanguage, translationLanguage, level, fontSize, selectedCategories]);

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
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
        <p>Built with Next.js and Supabase</p>
      </footer>
    </main>
  );
}