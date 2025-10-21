-- Add the image_url column to the og_facts table
ALTER TABLE public.og_facts
ADD COLUMN image_url TEXT NULL;

-- Drop the old function to recreate it with the new column
DROP FUNCTION IF EXISTS get_random_facts(TEXT[], TEXT, INT, INT);

-- Recreate the function to include the new image_url column in its output
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
    source_url TEXT,
    image_url TEXT -- Added new column
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        of.id,
        of.category,
        of.subcategory,
        of.source,
        of.source_url,
        of.image_url -- Select the new column
    FROM
        public.og_facts AS of
    INNER JOIN
        public.fact_translations AS ft ON of.id = ft.fact_id
    WHERE
        ft.language = p_language
        AND (
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