-- Add source columns to the og_facts table
ALTER TABLE public.og_facts
ADD COLUMN source TEXT NULL,
ADD COLUMN source_url TEXT NULL;

-- Create a function to get randomized facts
CREATE OR REPLACE FUNCTION get_random_facts(
    p_categories TEXT[],
    p_language TEXT,
    p_limit INT,
    p_offset INT
)
RETURNS TABLE (
    id UUID,
    category TEXT,
    subcategory TEXT,
    source TEXT,
    source_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        of.id,
        of.category,
        of.subcategory,
        of.source,
        of.source_url
    FROM
        public.og_facts AS of
    INNER JOIN
        public.fact_translations AS ft ON of.id = ft.fact_id
    WHERE
        ft.language = p_language
        AND (
            -- If p_categories is NULL or empty, don't filter by category.
            -- Otherwise, filter where the fact's category is in the array.
            p_categories IS NULL OR array_length(p_categories, 1) IS NULL OR of.category = ANY(p_categories)
        )
    ORDER BY
        random()
    LIMIT
        p_limit
    OFFSET
        p_offset;
END;
$$ LANGUAGE plpgsql;