"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Fact = {
  id: string;
  category: string | null;
  subcategory: string | null;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
};

type UseFactFeedProps = {
  settingsKey: number;
  selectedCategories: string[];
  contentLanguage: string;
};

const PAGE_LIMIT = 5;

export function useFactFeed({ settingsKey, selectedCategories, contentLanguage }: UseFactFeedProps) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const prevSettingsKey = useRef(settingsKey);

  const fetchFacts = useCallback(async (fetchPage: number, isReset: boolean) => {
    setIsLoading(true);
    setError("");
    try {
      const categoriesQuery = selectedCategories.join(',');
      const response = await fetch(
        `/api/get-facts?page=${fetchPage}&limit=${PAGE_LIMIT}&categories=${categoriesQuery}&language=${contentLanguage}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch facts");
      }
      const newFacts: Fact[] = await response.json();
      setHasMore(newFacts.length === PAGE_LIMIT);
      setFacts(prevFacts => {
        const currentFacts = isReset ? [] : prevFacts;
        const combined = [...currentFacts, ...newFacts];
        return Array.from(new Map(combined.map(f => [f.id, f])).values());
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategories, contentLanguage]);

  useEffect(() => {
    const isReset = prevSettingsKey.current !== settingsKey;
    if (isReset) {
      prevSettingsKey.current = settingsKey;
      setFacts([]);
      setPage(0);
      fetchFacts(0, true);
    } else {
      fetchFacts(page, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, settingsKey]);
  
  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return { facts, error, isLoading, hasMore, loadMore };
}