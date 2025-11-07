"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { loginAgent } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState = { success: false, message: "" };

export default function AgentLoginPage() {
  const [state, formAction] = useFormState(loginAgent, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/agent/dashboard");
    }
  }, [state.success, router]);

  return (
    <div className="w-full max-w-md rounded-3xl border border-charcoal/10 bg-white/80 p-10 shadow-subtle">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-charcoal">ログイン</h1>
        <p className="text-sm text-charcoal/70">審査が完了したアカウントでログインしてください。</p>
      </div>
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        {state.message && !state.success ? (
          <p className="text-sm text-red-500">{state.message}</p>
        ) : null}
        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-charcoal/70">
        初めてご利用の方は <Link href="/agent/register" className="font-semibold text-gold">こちらから登録</Link>
      </p>
    </div>
  );
}
