"use client";

import { useEffect, useState } from "react";
import { RentalRequestInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

export default function FormConfirmPage() {
  const router = useRouter();
  const [data, setData] = useState<RentalRequestInput | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("rental-request");
    if (!stored) {
      router.replace("/form");
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  const handleSubmit = async () => {
    if (!data) return;
    setSubmitting(true);
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      toast({ title: "送信が完了しました" });
      sessionStorage.removeItem("rental-request");
      router.push("/thanks");
    } else {
      const payload = await response.json().catch(() => ({ message: "エラーが発生しました" }));
      toast({ title: "送信できませんでした", description: payload.message ?? "しばらくしてから再度お試しください" });
    }
    setSubmitting(false);
  };

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Confirm</p>
        <h1 className="text-3xl font-semibold text-charcoal">この内容でリクエストを送信します</h1>
        <p className="text-sm text-charcoal/70">送信後、対応エリアの不動産会社に通知されます。</p>
      </div>
      <div className="space-y-6">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="rounded-3xl border border-charcoal/10 bg-white/80 p-6 shadow-subtle">
            <p className="text-xs uppercase tracking-widest text-charcoal/40">{key}</p>
            <p className="mt-2 text-base text-charcoal">{String(value ?? "-")}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          修正する
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              送信中...
            </span>
          ) : (
            "送信する"
          )}
        </Button>
      </div>
    </div>
  );
}
