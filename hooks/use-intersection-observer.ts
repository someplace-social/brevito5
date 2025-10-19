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
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [node, options]);

  return { ref, isIntersecting };
}