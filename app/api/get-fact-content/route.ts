import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { factId, language, level } = await request.json();

  if (!factId || !language || !level) {
    return NextResponse.json(
      { error: "Missing required parameters: factId, language, level" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // 1. Check for existing generated content
  const { data: existingContent, error: existingError } = await supabase
    .from("generated_content")
    .select("content")
    .eq("fact_id", factId)
    .eq("language", language)
    .eq("level", level)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    // PGRST116 is "No rows found", which is not an actual error for us here.
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existingContent) {
    return NextResponse.json({ content: existingContent.content });
  }

  // 2. If not found, fetch the original English text
  const { data: fact, error: factError } = await supabase
    .from("fun_facts")
    .select("english_text")
    .eq("id", factId)
    .single();

  if (factError) {
    return NextResponse.json({ error: factError.message }, { status: 500 });
  }

  if (!fact) {
    return NextResponse.json(
      { error: `Fact with id ${factId} not found` },
      { status: 404 },
    );
  }

  // 3. TODO: Call AI to translate and simplify
  // For now, we will just return the English text.
  const generatedText = fact.english_text;

  // 4. TODO: Insert the new content into the generated_content table for caching

  // 5. Return the generated text
  return NextResponse.json({ content: generatedText });
}