"use client";

import { useState, useEffect, useRef, RefObject } from "react";

export function useTextSelection(containerRef: RefObject<HTMLElement | null>) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const popoverOpenRef = useRef(popoverOpen);
  popoverOpenRef.current = popoverOpen;

  useEffect(() => {
    const handleSelectionChange = () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        requestAnimationFrame(() => {
          const selection = window.getSelection();
          const container = containerRef.current;

          if (!selection || !container || !selection.anchorNode || !container.contains(selection.anchorNode)) {
            if (popoverOpenRef.current) {
              setPopoverOpen(false);
            }
            return;
          }

          const text = selection.toString().trim();
          if (text && text.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerBounds = container.getBoundingClientRect();
            
            setSelectionRect(new DOMRect(
              rect.left - containerBounds.left, 
              rect.top - containerBounds.top, 
              rect.width, 
              rect.height
            ));
            
            setSelectedText(text);
            setPopoverOpen(true);
          } else {
            if (popoverOpenRef.current) {
              setPopoverOpen(false);
            }
          }
        });
      }, 150);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [containerRef]);
  
  useEffect(() => {
    if (!popoverOpen) {
      setSelectedText("");
      setSelectionRect(null);
      if (window.getSelection()?.toString()) {
        window.getSelection()?.removeAllRanges();
      }
    }
  }, [popoverOpen]);

  return { popoverOpen, setPopoverOpen, selectedText, selectionRect };
}