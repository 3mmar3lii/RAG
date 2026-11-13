import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUBA_BASE_URL!,
  process.env.SUBA_BASE_SECRET_KEY!,
);

// Store Data
// Store Data
interface DataShape {
  content: string;
  metadata: { fileName: string };
  embedding: number[];
}


export async function StoreChunks(data: DataShape[]) {
  const { error } = await supabase.from("documents").insert(data);
  if (error) throw new Error(error.message);
}

// Delete Data
export async function DeleteBySource(source: string) {
  const { error, data } = await supabase
    .from("documents")
    .delete()
    .contains("metadata", { fileName: source });
  if (error) throw new Error(error.message);
  return data;
}

export async function matchDoucments(
  userQueryVectorEmbede: number[],
  matchCount = 3,
) {
  const { data: documents, error } = await supabase.rpc("match_documents", {
    query_embedding: userQueryVectorEmbede,
    match_count: matchCount,
  });
  if (error) throw new Error(error?.message);
  return documents ?? [];
}
