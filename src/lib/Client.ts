import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUBA_BASE_URL!,
  process.env.SUBA_BASE_SECRET_KEY!,
);

// Store Data
interface DataShape {
  content: string;
  metadata: { fileName: string };
  embeded: number[];
}
export async function StoreChunks(data: DataShape[]) {
  // Store in Supabase
  const { error } = await supabase.from("documents").insert(data);
  if (error) throw new Error(error.message);
}

// Delete Data
export async function DeleteBySource(source: string) {
  const { error, data } = await supabase
    .from("documents")
    .delete()
    .contains("metadata", [source]);
  if (error) throw new Error(error.message);
  return data;
}
