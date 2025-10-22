"use client";

import { useState, useEffect, useCallback } from "react";

const availableCategories = ["Science", "Technology", "Health", "History", "Business", "Society", "Art", "Sports", "Environment", "Culture", "Food", "Geography", "Psychology", "Animals", "Space", "Language", "Unusual"];
const fontSizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];

export function useAppSettings() {
  const [contentLanguage, setContentLanguage] = useState("Spanish");
  const [translationLanguage, setTranslationLanguage] = useState("English");
  const [level, setLevel] = useState("Beginner");
  const [fontSize, setFontSize] = useState("text-lg");
  const [selectedCategories, setSelectedCategories] = useState(availableCategories);
  const [showImages, setShowImages] = useState(true);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [settingsKey, setSettingsKey] = useState(0);

  // Load settings from localStorage on initial mount
  useEffect(() => {
    const savedContentLang = localStorage.getItem("brevito-content-language");
    const savedTranslationLang = localStorage.getItem("brevito-translation-language");
    const savedLevel = localStorage.getItem("brevito-level");
    const savedFontSize = localStorage.getItem("brevito-font-size");
    const savedCategories = localStorage.getItem("brevito-categories");
    const savedShowImages = localStorage.getItem("brevito-show-images");

    if (savedContentLang) setContentLanguage(savedContentLang);
    if (savedTranslationLang) setTranslationLanguage(savedTranslationLang);
    if (savedLevel) setLevel(savedLevel);
    if (savedFontSize && fontSizes.includes(savedFontSize)) setFontSize(savedFontSize);
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
          setSelectedCategories(parsedCategories);
        }
      } catch {}
    }
    if (savedShowImages) {
      setShowImages(JSON.parse(savedShowImages));
    }
    setIsInitialized(true);
  }, []);

  // Effect to save settings and increment key when they change
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem("brevito-content-language", contentLanguage);
    localStorage.setItem("brevito-translation-language", translationLanguage);
    localStorage.setItem("brevito-level", level);
    localStorage.setItem("brevito-font-size", fontSize);
    localStorage.setItem("brevito-categories", JSON.stringify(selectedCategories));
    localStorage.setItem("brevito-show-images", JSON.stringify(showImages));
    
    setSettingsKey(prevKey => prevKey + 1);
  }, [contentLanguage, translationLanguage, level, fontSize, selectedCategories, showImages, isInitialized]);

  return {
    isInitialized,
    settingsKey,
    contentLanguage, setContentLanguage,
    translationLanguage, setTranslationLanguage,
    level, setLevel,
    fontSize, setFontSize,
    selectedCategories, setSelectedCategories,
    showImages, setShowImages,
    availableCategories
  };
}