-- Drop the old table used for caching Gemini responses, as it's being replaced.
DROP TABLE IF EXISTS public.generated_content;

-- Drop the old fun_facts table to replace it with og_facts.
DROP TABLE IF EXISTS public.fun_facts;

-- Create the table for the original English facts.
CREATE TABLE IF NOT EXISTS public.og_facts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    english_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security for the og_facts table.
ALTER TABLE public.og_facts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to the og_facts table.
CREATE POLICY "Allow public read access for og_facts"
ON public.og_facts
FOR SELECT USING (true);

-- Create the single table to hold all translations for all languages.
CREATE TABLE IF NOT EXISTS public.fact_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fact_id UUID NOT NULL REFERENCES public.og_facts(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    beginner_text TEXT,
    intermediate_text TEXT,
    advanced_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    -- Ensure that for any given fact, there's only one entry per language.
    UNIQUE (fact_id, language)
);

-- Enable Row Level Security for the fact_translations table.
ALTER TABLE public.fact_translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to the fact_translations table.
CREATE POLICY "Allow public read access for fact_translations"
ON public.fact_translations
FOR SELECT USING (true);