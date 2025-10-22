"use client";

import { useState, useEffect, useCallback } from "react";

type Fact = {
  id: string;
  category: string | null;
  subcategory: string | null;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
};

type UseFactFeedProps = {
  isInitialized: boolean;
  settingsKey: number;
  selectedCategories: string[];
  contentLanguage: string;
};

const PAGE_LIMIT = 5;
const FEED_CACHE_KEY = "brevito-feed-cache";

type CachedFeed = {
  facts: Fact[];
  page: number;
  hasMore: boolean;
  timestamp: number;
};

export function useFactFeed({ isInitialized, settingsKey, selectedCategories, contentLanguage }: UseFactFeedProps) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Effect to hydrate state from sessionStorage on initial load
  useEffect(() => {
    try {
      const cachedData = sessionStorage.getItem(FEED_CACHE_KEY);
      if (cachedData) {
        const { facts: cachedFacts, page: cachedPage, hasMore: cachedHasMore, timestamp }: CachedFeed = JSON.parse(cachedData);
        // Invalidate cache after 15 minutes
        if (Date.now() - timestamp < 15 * 60 * 1000) {
          setFacts(cachedFacts);
          setPage(cachedPage);
          setHasMore(cachedHasMore);
        } else {
          sessionStorage.removeItem(FEED_CACHE_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to parse cached feed", e);
      sessionStorage.removeItem(FEED_CACHE_KEY);
    }
    setIsHydrated(true);
  }, []);

  // Effect to save state to sessionStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    const cache: CachedFeed = { facts, page, hasMore, timestamp: Date.now() };
    sessionStorage.setItem(FEED_CACHE_KEY, JSON.stringify(cache));
  }, [facts, page, hasMore, isHydrated]);

  // Reset feed when settings change
  useEffect(() => {
    if (!isInitialized) return;
    // The initial settingsKey change (0 -> 1) happens on first load,
    // we don't want to clear the hydrated cache in that case.
    if (settingsKey > 1) {
      setFacts([]);
      setPage(0);
      setHasMore(true);
      sessionStorage.removeItem(FEED_CACHE_KEY);
    }
  }, [settingsKey, isInitialized]);

  const fetchFacts = useCallback(async (currentPage: number) => {
    // Prevent fetching if we already have facts from hydration
    if (currentPage === 0 && facts.length > 0) return;

    setIsLoading(true);
    setError("");
    try {
      const categoriesQuery = selectedCategories.join(',');
      const response = await fetch(
        `/api/get-facts?page=${currentPage}&limit=${PAGE_LIMIT}&categories=${categoriesQuery}&language=${contentLanguage}`,
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
  }, [selectedCategories, contentLanguage, facts.length]);

  // Effect to fetch facts when page or settings change
  useEffect(() => {
    if (isInitialized && isHydrated) {
      fetchFacts(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, settingsKey, isInitialized, isHydrated]);
  
  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { facts, error, isLoading, hasMore, loadMore, isHydrated };
}