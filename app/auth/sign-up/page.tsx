import { AuthForm } from "@/components/auth-form";
import { hasSupabaseConfig } from "@/lib/env";

export const metadata = { title: "注册" };

export default function SignUpPage() {
  return <AuthForm mode="sign-up" configured={hasSupabaseConfig()} />;
}
