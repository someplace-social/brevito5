"use client";

import { FactCard } from "@/components/fact-card";
import { OptionsMenu } from "@/components/options-menu";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useFactFeed } from "@/hooks/use-fact-feed";
import { useEffect, useLayoutEffect, useRef } from "react";

const ANCHOR_ID_KEY = "brevito-scroll-anchor-id";

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

  const { facts, error, isLoading, hasMore, loadMore, isHydrated } = useFactFeed({
    isInitialized,
    settingsKey,
    selectedCategories,
    contentLanguage,
  });

  const { ref: infiniteScrollRef, isIntersecting } = useIntersectionObserver({ threshold: 1.0 });
  const topVisibleFactRef = useRef<string | null>(null);

  useEffect(() => {
    if (isIntersecting) {
      loadMore();
    }
  }, [isIntersecting, loadMore]);

  // This effect sets up an observer to track which fact card is at the top of the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.boundingClientRect.top >= 0) {
            topVisibleFactRef.current = entry.target.id;
          }
        });
      },
      { threshold: 0.5 } // Tracks when 50% of the item is visible
    );

    const factElements = document.querySelectorAll('[id^="fact-"]');
    factElements.forEach((el) => observer.observe(el));

    return () => {
      factElements.forEach((el) => observer.unobserve(el));
      // When we navigate away, save the last known top-visible fact ID
      if (topVisibleFactRef.current) {
        sessionStorage.setItem(ANCHOR_ID_KEY, topVisibleFactRef.current);
      }
    };
  }, [facts]); // Rerun this effect when the list of facts changes

  // This effect restores the scroll position to the saved anchor fact
  useLayoutEffect(() => {
    if (isHydrated && facts.length > 0) {
      const anchorId = sessionStorage.getItem(ANCHOR_ID_KEY);
      if (anchorId) {
        const anchorElement = document.getElementById(anchorId);
        if (anchorElement) {
          // Use a timeout to ensure the browser has had time to paint
          setTimeout(() => {
            anchorElement.scrollIntoView({ block: 'start' });
            sessionStorage.removeItem(ANCHOR_ID_KEY);
          }, 100); // A small delay can make a big difference on mobile
        }
      }
    }
  }, [isHydrated, facts.length]);

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
              imageUrl={fact.image_url}
              showImages={showImages}
              onCategoryFilter={handleCategoryFilter}
            />
          ))}

          {hasMore && !isLoading && <div ref={infiniteScrollRef} className="h-1" />}

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