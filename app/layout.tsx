import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PIck · 找导师", template: "%s · PIck" },
  description: "PIck 找导师项目的受限测试环境。",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="border-b">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-2xl font-semibold tracking-tight" aria-label="PIck 首页">PIck<span className="text-primary">.</span></Link>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">测试环境</span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-12">{children}</main>
        <footer className="mx-auto max-w-3xl px-6 pb-8 text-sm text-muted-foreground">从一个真实需求开始，逐步找到合适的导师。</footer>
      </body>
    </html>
  );
}
