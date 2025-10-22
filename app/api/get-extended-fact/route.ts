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

  // Dynamically select the correct extended column based on the user's level.
  const levelColumn = `${level.toLowerCase()}_text_extended`;

  const { data, error } = await supabase
    .from("fact_translations")
    .select(levelColumn)
    .eq("fact_id", factId)
    .eq("language", language)
    .single();

  if (error) {
    console.error("Error fetching extended fact content:", error.message);
    return NextResponse.json({ error: "Could not find the requested extended content." }, { status: 404 });
  }

  if (!data) {
    return NextResponse.json({ error: "Extended content not found." }, { status: 404 });
  }

  const content = data[levelColumn as keyof typeof data];

  // Also fetch the original fact data like source and image
  const { data: ogFactData, error: ogFactError } = await supabase
    .from("og_facts")
    .select("source, source_url, image_url, category, subcategory")
    .eq("id", factId)
    .single();

  if (ogFactError) {
    console.error("Error fetching original fact data:", ogFactError.message);
    // Continue without it, but log the error
  }

  return NextResponse.json({ content, ...ogFactData });
}