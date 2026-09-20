import { AuthForm } from "@/components/auth-form";
import { hasSupabaseConfig } from "@/lib/env";

export const metadata = { title: "登录" };

export default function LoginPage() {
  return <AuthForm mode="login" configured={hasSupabaseConfig()} />;
}
