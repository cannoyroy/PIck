import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";

export async function requireUser() {
  if (!hasSupabaseConfig()) redirect("/auth/login");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || typeof data.claims.sub !== "string") {
    redirect("/auth/login");
  }
  return { supabase, userId: data.claims.sub };
}
