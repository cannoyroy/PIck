"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="space-y-4"><h1 className="text-2xl font-semibold">暂时无法完成请求</h1><p>请检查网络后重试。如果问题持续，请联系维护者。</p><button onClick={reset} className="rounded-lg border px-4 py-2">重试</button></section>;
}
