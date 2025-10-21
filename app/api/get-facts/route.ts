import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "0");
  const limit = parseInt(searchParams.get("limit") || "5");
  const categoriesParam = searchParams.get("categories");
  const language = searchParams.get("language");
  const offset = page * limit;

  const categories = categoriesParam ? categoriesParam.split(',') : null;

  const supabase = await createClient();

  const { data: facts, error } = await supabase.rpc('get_random_facts', {
    p_categories: categories,
    p_language: language,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("Error calling get_random_facts RPC:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(facts);
}