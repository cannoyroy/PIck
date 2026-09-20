"use client";

import { useActionState } from "react";
import { addRecord, deleteRecord, logout } from "@/app/protected/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddRecordForm() {
  const [state, action, pending] = useActionState(addRecord, {});
  return <form action={action} className="space-y-3">
    <Label htmlFor="content">测试内容</Label>
    <div className="flex gap-3"><Input id="content" name="content" required maxLength={200} placeholder="例如：我的第一条测试记录" disabled={pending} /><Button type="submit" disabled={pending}>{pending ? "保存中…" : "保存"}</Button></div>
    {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-primary">{state.success}</p>}
  </form>;
}

export function DeleteRecordForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteRecord, {});
  return <form action={action}>
    <input type="hidden" name="id" value={id} />
    <Button size="sm" variant="outline" type="submit" disabled={pending}>{pending ? "删除中…" : "删除"}</Button>
    {state.error && <p role="alert" className="mt-2 text-sm text-destructive">{state.error}</p>}
  </form>;
}

export function LogoutForm() {
  const [state, action, pending] = useActionState(logout, {});
  return <form action={action}>
    <Button type="submit" variant="outline" disabled={pending}>{pending ? "退出中…" : "退出登录"}</Button>
    {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
  </form>;
}
