"use client";

// Adapted from the MIT-licensed Next.js with-supabase password-auth starter.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AuthForm({ mode, configured }: { mode: "login" | "sign-up"; configured: boolean }) {
  const signup = mode === "sign-up";
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (signup && password !== form.get("repeatPassword")) {
      setError("两次输入的密码不一致。");
      return;
    }
    setPending(true);
    try {
      const supabase = createClient();
      const result = signup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        const code = result.error.code;
        setError(code === "invalid_credentials"
          ? "邮箱或密码不正确。"
          : code === "email_not_confirmed"
            ? "请先完成邮箱验证，再登录。"
            : code === "over_request_rate_limit" || code === "over_email_send_rate_limit"
              ? "操作过于频繁，请稍后再试。"
              : signup ? "注册未完成，请检查邮箱、密码或稍后重试。" : "登录未完成，请稍后重试。");
        return;
      }
      if (!result.data.session) {
        setError("账号尚未进入登录状态，请先完成邮箱验证再登录。");
        return;
      }
      router.replace("/protected");
      router.refresh();
    } catch {
      setError("暂时无法连接账号服务，请检查网络后重试。");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle><h1 className="text-2xl">{signup ? "创建测试账号" : "登录 PIck"}</h1></CardTitle>
        <CardDescription>{signup ? "此环境仅用于测试，请勿使用重要账号的密码。" : "登录后查看属于你的测试记录。"}</CardDescription>
      </CardHeader>
      <CardContent>
        {!configured && <p role="status" className="mb-5 text-sm">服务尚未配置，注册和登录暂不可用。维护者请查看 README。</p>}
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="email">邮箱</Label><Input id="email" name="email" type="email" autoComplete="email" required disabled={!configured || pending} /></div>
          <div className="space-y-2"><Label htmlFor="password">密码</Label><Input id="password" name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={signup ? 8 : undefined} maxLength={128} required disabled={!configured || pending} />{signup && <p className="text-xs text-muted-foreground">至少 8 位。</p>}</div>
          {signup && <div className="space-y-2"><Label htmlFor="repeatPassword">确认密码</Label><Input id="repeatPassword" name="repeatPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required disabled={!configured || pending} /></div>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" type="submit" disabled={!configured || pending}>{pending ? "处理中…" : signup ? "注册" : "登录"}</Button>
        </form>
        <p className="mt-5 text-sm text-muted-foreground">{signup ? "已有账号？" : "还没有账号？"} <Link className="text-primary underline" href={signup ? "/auth/login" : "/auth/sign-up"}>{signup ? "去登录" : "去注册"}</Link></p>
      </CardContent>
    </Card>
  );
}
