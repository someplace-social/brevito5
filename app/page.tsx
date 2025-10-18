"use client";

import { FactCard } from "@/components/fact-card";
import { useEffect, useState } from "react";

type Fact = {
  id: string;
};

export default function Home() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getFacts = async () => {
      try {
        const response = await fetch("/api/get-facts");
        if (!response.ok) {
          throw new Error("Failed to fetch facts");
        }
        const data = await response.json();
        setFacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };
    getFacts();
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="w-full max-w-2xl flex items-center p-3 px-5 text-sm font-semibold">
          Brevito
        </div>
      </nav>
      <div className="flex-1 w-full flex flex-col items-center p-4">
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {error && <p className="text-red-500">{error}</p>}
          {facts.length > 0 ? (
            facts.map((fact) => <FactCard key={fact.id} factId={fact.id} />)
          ) : (
            <p>No facts found. Add some to your database!</p>
          )}
        </div>
      </div>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
        <p>Built with Next.js and Supabase</p>
      </footer>
    </main>
  );
}