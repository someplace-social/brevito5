"use client";

import { FactCard } from "@/components/fact-card";
import { OptionsMenu } from "@/components/options-menu";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useFactFeed } from "@/hooks/use-fact-feed";
import { useEffect, useState } from "react";
import { ExtendedFactSheet } from "@/components/extended-fact-sheet";
import { Menu } from "lucide-react";

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

  const { facts, error, isLoading, hasMore, loadMore } = useFactFeed({
    isInitialized,
    settingsKey,
    selectedCategories,
    contentLanguage,
  });

  const { ref: infiniteScrollRef, isIntersecting } = useIntersectionObserver({ threshold: 1.0 });
  const [extendedFactId, setExtendedFactId] = useState<string | null>(null);

  useEffect(() => {
    if (isIntersecting) {
      loadMore();
    }
  }, [isIntersecting, loadMore]);

  const handleCategoryFilter = (category: string) => {
    const isAlreadyFiltered = selectedCategories.length === 1 && selectedCategories[0] === category;
    
    if (category && !isAlreadyFiltered) {
      setSelectedCategories([category]);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setExtendedFactId(null);
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
              triggerIcon={<Menu />}
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
              onReadMore={setExtendedFactId}
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
      <ExtendedFactSheet
        factId={extendedFactId}
        isOpen={!!extendedFactId}
        onOpenChange={handleOpenChange}
        language={contentLanguage}
        translationLanguage={translationLanguage}
        level={level}
        fontSize={fontSize}
        showImages={showImages}
      />
    </main>
  );
}