"use client";

import { useState, useEffect, useCallback } from "react";

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIntersecting] = useState(false);
  const [node, setNode] = useState<Element | null>(null);

  const ref = useCallback((newNode: Element | null) => {
    setNode(newNode);
  }, []);

  useEffect(() => {
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      // We only care about the transition from not-intersecting to intersecting.
      if (entry.isIntersecting) {
        setIntersecting(true);
        // Stop observing the element once it has been seen.
        observer.unobserve(node);
      }
    }, options);

    observer.observe(node);

    // Cleanup: disconnect the observer when the component unmounts.
    return () => observer.disconnect();
  }, [node, options]);

  return { ref, isIntersecting };
}