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
  settingsKey: number; // This is now the dataKey
  selectedCategories: string[];
  contentLanguage: string;
};

const PAGE_LIMIT = 5;

export function useFactFeed({ isInitialized, settingsKey, selectedCategories, contentLanguage }: UseFactFeedProps) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFacts = useCallback(async (fetchPage: number) => {
    setIsLoading(true);
    setError("");
    try {
      const categoriesQuery = selectedCategories.join(',');
      const response = await fetch(
        `/api/get-facts?page=${fetchPage}&limit=${PAGE_LIMIT}&categories=${categoriesQuery}&language=${contentLanguage}`,
      );
      if (!response.ok) throw new Error("Failed to fetch facts");
      const newFacts: Fact[] = await response.json();

      if (newFacts.length < PAGE_LIMIT) {
        setHasMore(false);
      }

      setFacts((prevFacts) => {
        const combined = fetchPage === 0 ? newFacts : [...prevFacts, ...newFacts];
        const uniqueFacts = Array.from(new Map(combined.map(f => [f.id, f])).values());
        return uniqueFacts;
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategories, contentLanguage]);

  // Effect to reset and fetch on settings change
  useEffect(() => {
    if (isInitialized) {
      setFacts([]);
      setPage(0);
      setHasMore(true);
      // This effect will trigger a fetch for page 0 via the next effect
    }
  }, [settingsKey, isInitialized]);

  // Effect to fetch facts when page changes or after a reset
  useEffect(() => {
    if (isInitialized) {
      fetchFacts(page);
    }
  }, [page, fetchFacts, isInitialized]);
  
  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { facts, error, isLoading, hasMore, loadMore };
} 