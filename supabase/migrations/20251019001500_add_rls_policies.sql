-- Enable Row Level Security
ALTER TABLE fun_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON fun_facts
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON generated_content
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON word_translations
FOR SELECT USING (true);