import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "0");
  const limit = parseInt(searchParams.get("limit") || "5");
  const categoriesParam = searchParams.get("categories");
  const language = searchParams.get("language");
  const start = page * limit;
  const end = start + limit - 1;

  const supabase = await createClient();
  
  // The 'fact_translations!inner(language)' part creates an inner join.
  // This ensures we only select 'og_facts' that have a matching translation.
  let query = supabase
    .from("og_facts")
    .select("id, category, subcategory, fact_translations!inner(language)");

  // Filter by the selected language from the frontend
  if (language) {
    query = query.eq("fact_translations.language", language);
  }

  // Filter by the selected categories
  if (categoriesParam) {
    const categories = categoriesParam.split(',');
    if (categories.length > 0) {
      query = query.in('category', categories);
    }
  }

  // Apply ordering and pagination
  query = query
    .order("created_at", { ascending: false })
    .range(start, end);

  const { data: facts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(facts);
}