-- Create the fun_facts table
CREATE TABLE fun_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  english_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create the generated_content table
CREATE TABLE generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fact_id uuid REFERENCES fun_facts(id) ON DELETE CASCADE,
  language text NOT NULL,
  level text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (fact_id, language, level)
);

-- Create the word_translations table
CREATE TABLE word_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fact_id uuid,
  language text,
  level text,
  word text,
  translation text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (fact_id, language, level, word)
);