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

  // Dynamically select the correct column based on the user's level.
  // e.g., 'beginner' becomes 'beginner_text'.
  const levelColumn = `${level.toLowerCase()}_text`;

  const { data, error } = await supabase
    .from("fact_translations")
    .select(levelColumn)
    .eq("fact_id", factId)
    .eq("language", language)
    .single();

  if (error) {
    console.error("Error fetching translated content:", error.message);
    return NextResponse.json({ error: "Could not find the requested translation." }, { status: 404 });
  }

  if (!data) {
    return NextResponse.json({ error: "Translation not found." }, { status: 404 });
  }

  const content = data[levelColumn as keyof typeof data];

  return NextResponse.json({ content });
}