import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// This is the structure of the response from the Gemini API
type GeminiApiResponse = {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
};

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

  // 3. Call AI to translate and simplify
  const genAIKey = process.env.GEN_AI_KEY;
  if (!genAIKey) {
    return NextResponse.json(
      { error: "AI API key is not configured on the server." },
      { status: 500 },
    );
  }

  const prompt = `Translate and simplify this sentence into ${language} at a ${level} level. Keep the same meaning. Output only the translated sentence, with no extra text or quotation marks.
Sentence: "${fact.english_text}"`;

  let generatedText = "";

  try {
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${genAIKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.json();
      console.error("AI API Error:", errorBody);
      throw new Error(`AI API request failed with status ${aiResponse.status}`);
    }

    const aiData: GeminiApiResponse = await aiResponse.json();
    generatedText = aiData.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate content from AI." },
      { status: 500 },
    );
  }

  // 4. Insert the new content into the generated_content table for caching
  const { error: insertError } = await supabase
    .from("generated_content")
    .insert({
      fact_id: factId,
      language,
      level,
      content: generatedText,
    });

  if (insertError) {
    // Log the error but don't block the response to the user
    console.error("Failed to cache generated content:", insertError.message);
  }

  // 5. Return the generated text
  return NextResponse.json({ content: generatedText });
}