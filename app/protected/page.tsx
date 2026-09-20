import { requireUser } from "@/lib/auth";
import { AddRecordForm, DeleteRecordForm, LogoutForm } from "@/components/record-forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "我的测试记录" };

export default async function ProtectedPage() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.from("foundation_checks").select("id, content, created_at").order("created_at", { ascending: false }).limit(100);
  return <section className="space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-semibold">我的测试记录</h1><LogoutForm /></div>
    <p className="text-sm leading-6 text-muted-foreground">这里只显示当前账号的记录，用于验证保存和隔离。请勿输入真实业务数据。最多显示最近 100 条。</p>
    {error ? <p role="alert" className="rounded-lg border p-4 text-destructive">暂时无法读取记录。请联系维护者检查数据库迁移和连接；这不代表你没有记录。</p> : <>
      <div className="rounded-xl border bg-card p-5"><AddRecordForm /></div>
      {!data?.length ? <p className="text-muted-foreground">还没有测试记录。</p> : <ul className="space-y-3" aria-label="测试记录">
        {data.map((record) => <li key={record.id} className="flex items-start justify-between gap-4 rounded-xl border bg-card p-5">
          <div className="min-w-0"><p className="whitespace-pre-wrap break-words">{record.content}</p><time dateTime={record.created_at} className="mt-2 block text-xs text-muted-foreground">{new Date(record.created_at).toISOString().replace("T", " ").slice(0, 19)} UTC</time></div>
          <DeleteRecordForm id={record.id} />
        </li>)}
      </ul>}
    </>}
  </section>;
}
