"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export type ActionState = { error?: string; success?: string };

export async function addRecord(_previous: ActionState, form: FormData): Promise<ActionState> {
  const { supabase, userId } = await requireUser();
  const content = String(form.get("content") ?? "").trim();
  if (!content || content.length > 200) return { error: "请输入 1–200 字的测试内容。" };
  const { error } = await supabase.from("foundation_checks").insert({ content, user_id: userId });
  if (error) return { error: "保存失败，请确认数据库已准备好或稍后重试。" };
  revalidatePath("/protected");
  return { success: "已保存。" };
}

export async function deleteRecord(_previous: ActionState, form: FormData): Promise<ActionState> {
  const { supabase, userId } = await requireUser();
  const id = String(form.get("id") ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { error: "记录标识无效。" };
  }
  const { data, error } = await supabase.from("foundation_checks").delete().eq("id", id).eq("user_id", userId).select("id");
  if (error) return { error: "删除失败，请稍后重试。" };
  if (!data?.length) return { error: "记录不存在或不可删除。" };
  revalidatePath("/protected");
  return { success: "已删除。" };
}

export async function logout(): Promise<ActionState> {
  const { supabase } = await requireUser();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) return { error: "退出未完成，请稍后重试。" };
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
