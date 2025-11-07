import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ThanksPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-24 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-gold">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-semibold text-charcoal">リクエストを受け付けました</h1>
      <p className="text-sm leading-relaxed text-charcoal/70">
        ご入力いただいた条件をもとに、対応可能な不動産会社に通知しました。担当者からのご連絡をお待ちください。
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button asChild size="lg">
          <Link href="/">トップへ戻る</Link>
        </Button>
        <p className="text-xs text-charcoal/50">受付メールを送信しています。迷惑メールフォルダもご確認ください。</p>
      </div>
    </div>
  );
}
