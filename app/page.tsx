import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Building2, Sparkles, ShieldCheck, Send, Mail } from "lucide-react";

const features = [
  {
    title: "希望条件を送信",
    description: "エリア・間取り・ご予算などをステップ形式で入力するだけ。",
    icon: Send
  },
  {
    title: "AIで即マッチング",
    description: "登録済みの対応エリアから最適な不動産会社へ自動配信します。",
    icon: Sparkles
  },
  {
    title: "進捗を可視化",
    description: "不動産会社はダッシュボードで閲覧状況を管理し、レスポンス率を向上。",
    icon: ShieldCheck
  }
];

const partners = [
  "都心専門", "駅近特化", "法人仲介", "高級賃貸", "ファミリー向け"
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-gradient-to-b from-beige-50 via-beige-100 to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 md:flex-row md:items-center md:pt-24">
          <div className="space-y-8 md:w-1/2">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/60 px-4 py-2 text-xs font-medium text-gold">
              <Sparkles className="h-4 w-4" /> OfferRoom - 逆リクエスト型賃貸
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl">
              希望条件を送るだけ。
              <br />
              理想の部屋探しをプロが叶えます。
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-charcoal/70">
              OfferRoomは、賃貸希望者の希望条件をもとに対応可能な不動産会社へリードを配信する逆リクエスト型賃貸プラットフォームです。忙しいあなたの代わりに、信頼できる不動産パートナーがご提案します。
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/form">希望条件を送信する</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#for-agents">不動産会社の方へ</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/60">
              {partners.map((partner) => (
                <span key={partner} className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-subtle">
                  <Building2 className="h-4 w-4 text-gold" />
                  {partner}
                </span>
              ))}
            </div>
          </div>
          <div className="relative md:w-1/2">
            <div className="relative z-10 rounded-[32px] border border-gold/40 bg-white/90 p-8 shadow-[0_50px_90px_-40px_rgba(212,175,55,0.45)] backdrop-blur">
              <h2 className="text-lg font-semibold text-charcoal">ステップフォーム</h2>
              <p className="mt-2 text-sm text-charcoal/70">
                エリア・ご予算・こだわり条件など、最短3分で入力完了。
              </p>
              <div className="mt-8 space-y-4">
                {["エリア", "予算", "間取り", "ライフスタイル"].map((step, idx) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{step}</p>
                      <p className="text-xs text-charcoal/60">最適な提案のためにヒアリングします</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-12 left-10 h-52 w-full rounded-[36px] bg-gradient-to-r from-gold/30 to-transparent blur-3xl" />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-4 rounded-3xl border border-charcoal/10 bg-beige-50/60 p-8 shadow-subtle">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal">{feature.title}</h3>
              <p className="text-sm text-charcoal/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="for-agents" className="bg-beige-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-charcoal/10 bg-white/90 p-10 shadow-subtle">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1 text-xs font-semibold text-gold">
                  <CheckCircle2 className="h-4 w-4" /> 審査制パートナー
                </span>
                <h2 className="text-3xl font-semibold text-charcoal">不動産会社向けリード配信SaaS</h2>
                <p className="max-w-xl text-sm text-charcoal/70">
                  審査を通過した不動産会社にのみリードを配信。対応エリアや得意分野の登録によって、無駄な問い合わせを削減し、成約率向上につなげます。
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-charcoal/70">
                  <span className="flex items-center gap-2 rounded-full bg-beige-50 px-4 py-2"><ShieldCheck className="h-4 w-4 text-gold" /> 審査制アカウント</span>
                  <span className="flex items-center gap-2 rounded-full bg-beige-50 px-4 py-2"><Mail className="h-4 w-4 text-gold" /> 新規リード通知</span>
                  <span className="flex items-center gap-2 rounded-full bg-beige-50 px-4 py-2"><Building2 className="h-4 w-4 text-gold" /> エリア別配信</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/agent/register">無料で登録する</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/agent/login">ログイン</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-charcoal py-12 text-beige-100">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 px-6 text-sm text-beige-200/80 md:flex-row">
          <p>© {new Date().getFullYear()} OfferRoom. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-white">
              利用規約
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
