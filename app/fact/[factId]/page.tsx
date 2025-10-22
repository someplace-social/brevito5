"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ExtendedFactData = {
  content: string | null;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
  category: string | null;
  subcategory: string | null;
};

export default function ExtendedFactPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const factId = params.factId as string;
  const language = searchParams.get("language");
  const level = searchParams.get("level");
  const fontSize = searchParams.get("fontSize") || "text-lg";
  const showImages = searchParams.get("showImages") === 'true';

  const [data, setData] = useState<ExtendedFactData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (factId && language && level) {
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
    }
  }, [factId, language, level]);

  return (
    <main className="flex flex-col items-center min-h-screen">
      <header className="w-full flex justify-center border-b border-b-foreground/10 sticky top-0 bg-background/95 backdrop-blur-sm z-10 p-4">
        <div className="w-full max-w-2xl relative flex justify-start items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
        </div>
      </header>
      <div className="flex-1 w-full flex flex-col items-center p-4">
        <div className="w-full max-w-2xl flex flex-col gap-4">
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
                    className={cn(
                      "object-cover transition-opacity duration-300",
                      isImageLoading ? "opacity-0" : "opacity-100"
                    )}
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
    </main>
  );
}