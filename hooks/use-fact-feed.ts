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

export function useFactFeed({ isInitialized, settingsKey, selectedCategories, contentLanguage }: UseFactFeedProps) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Reset feed when settings change
  useEffect(() => {
    if (!isInitialized) return;
    setFacts([]);
    setPage(0);
    setHasMore(true);
  }, [settingsKey, isInitialized]);

  const fetchFacts = useCallback(async (currentPage: number) => {
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
        // If it's the first page, replace the facts. Otherwise, append.
        const combinedFacts = currentPage === 0 ? newFacts : [...prevFacts, ...newFacts];
        const uniqueFactsMap = new Map(combinedFacts.map((fact: Fact) => [fact.id, fact]));
        return Array.from(uniqueFactsMap.values());
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategories, contentLanguage]);

  // Effect to fetch facts when page or settings change
  useEffect(() => {
    if (isInitialized) {
      fetchFacts(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, settingsKey, isInitialized]);
  
  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { facts, error, isLoading, hasMore, loadMore };
}