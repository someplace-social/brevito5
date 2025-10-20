-- Drop the incorrect tools table
DROP TABLE IF EXISTS public.tools;

-- Delete the incorrect storage bucket
DELETE FROM storage.buckets WHERE id = 'tool_images';