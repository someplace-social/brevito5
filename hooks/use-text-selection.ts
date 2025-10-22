"use client";

import { useState, useEffect, useRef, RefObject } from "react";

export function useTextSelection(cardRef: RefObject<HTMLElement | null>) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || !cardRef.current || !cardRef.current.contains(selection.anchorNode)) {
          if (popoverOpen) setPopoverOpen(false);
          return;
        }

        const text = selection.toString().trim();
        if (text && text.length > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const cardBounds = cardRef.current.getBoundingClientRect();
          setSelectionRect(new DOMRect(rect.left - cardBounds.left, rect.top - cardBounds.top, rect.width, rect.height));
          
          if (text !== selectedText) {
            setSelectedText(text);
          }
          setPopoverOpen(true);
        } else {
          setPopoverOpen(false);
        }
      }, 300);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [popoverOpen, selectedText, cardRef]);
  
  // Effect to clear selected text when popover closes
  useEffect(() => {
    if (!popoverOpen) {
      setSelectedText("");
    }
  }, [popoverOpen]);

  return { popoverOpen, setPopoverOpen, selectedText, selectionRect };
}