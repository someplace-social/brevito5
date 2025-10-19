-- Allow server-side inserts into the generated_content table for caching.
create policy "Allow anon insert for generated_content"
on public.generated_content
for insert
to anon
with check (true);

-- Allow server-side inserts into the word_translations table for caching.
create policy "Allow anon insert for word_translations"
on public.word_translations
for insert
to anon
with check (true);