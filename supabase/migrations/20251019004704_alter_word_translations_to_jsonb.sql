-- Clear the table because the old text data is not compatible with the new jsonb format.
TRUNCATE TABLE "public"."word_translations";

-- Alter the column type from text to jsonb to store structured translation data.
ALTER TABLE "public"."word_translations"
ALTER COLUMN "translation" TYPE jsonb USING "translation"::jsonb;