"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ExtendedFactData = {
  content: string | null;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
  category: string | null;
  subcategory: string | null;
};

type ExtendedFactSheetProps = {
  factId: string | null;
  language: string;
  level: string;
  fontSize: string;
  showImages: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function ExtendedFactSheet({
  factId,
  language,
  level,
  fontSize,
  showImages,
  isOpen,
  onOpenChange,
}: ExtendedFactSheetProps) {
  const [data, setData] = useState<ExtendedFactData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (isOpen && factId) {
      const fetchExtendedContent = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch("/api/get-extended-fact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ factId, language, level }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch extended content");
          }
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
          setIsLoading(false);
        }
      };
      fetchExtendedContent();
    } else {
      // Reset state when sheet is closed
      setData(null);
      setError(null);
      setIsLoading(true);
    }
  }, [factId, isOpen, language, level]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-screen h-screen sm:max-w-full p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-b-foreground/10 text-left flex-shrink-0">
          <SheetTitle className="sr-only">Extended Fact Details</SheetTitle>
          <SheetDescription className="sr-only">
            More detailed information about the selected fact.
          </SheetDescription>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <ArrowLeft />
          </Button>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : error ? (
              <p className="text-center text-destructive py-4">{error}</p>
            ) : data ? (
              <article className="space-y-6">
                {showImages && data.image_url && (
                  <div className="relative w-full aspect-[16/9] bg-muted rounded-lg overflow-hidden">
                    {isImageLoading && <Skeleton className="w-full h-full" />}
                    <Image
                      src={data.image_url}
                      alt={data.category || 'Fact image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={cn("object-cover transition-opacity duration-300", isImageLoading ? "opacity-0" : "opacity-100")}
                      onLoad={() => setIsImageLoading(false)}
                    />
                  </div>
                )}
                {data.category && (
                  <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {data.category}
                    {data.subcategory && <span> &gt; {data.subcategory}</span>}
                  </div>
                )}
                <p className={`leading-relaxed ${fontSize}`}>{data.content}</p>
                {data.source && data.source_url && (
                  <div className="text-sm text-muted-foreground pt-4 border-t">
                    <a href={data.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      Source: {data.source}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </article>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}