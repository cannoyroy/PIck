import Link from "next/link";
import { Button } from "@/components/ui/button";
import { hasSupabaseConfig } from "@/lib/env";

export default function HomePage() {
  return (
    <section className="space-y-7 py-10">
      <p className="text-sm font-medium tracking-widest text-primary">PIck / 工程测试</p>
      <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">找导师，从这里开始。</h1>
      <p className="max-w-lg leading-7 text-muted-foreground">当前开放账号与私有测试记录的验证。具体找导师功能将在真实需求确认后逐步加入。</p>
      <nav className="flex flex-wrap gap-3" aria-label="账号入口">
        <Button asChild><Link href="/auth/login">登录</Link></Button>
        <Button asChild variant="outline"><Link href="/auth/sign-up">注册</Link></Button>
        <Button asChild variant="ghost"><Link href="/protected">我的测试记录</Link></Button>
      </nav>
      {!hasSupabaseConfig() && <p role="status" className="rounded-lg border bg-card p-4 text-sm">服务尚未配置，注册和登录暂不可用。维护者请按 README 配置 Supabase 后重启应用。</p>}
    </section>
  );
}
