import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "0");
  const limit = parseInt(searchParams.get("limit") || "5");
  const categoriesParam = searchParams.get("categories");
  const start = page * limit;
  const end = start + limit - 1;

  const supabase = await createClient();
  let query = supabase
    .from("og_facts")
    .select("id, category, subcategory");

  if (categoriesParam) {
    const categories = categoriesParam.split(',');
    if (categories.length > 0) {
      query = query.in('category', categories);
    }
  }

  query = query
    .order("created_at", { ascending: false })
    .range(start, end);

  const { data: facts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(facts);
} 