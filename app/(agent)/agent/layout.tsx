import Link from "next/link";
import { logoutAgent } from "@/app/(auth)/agent/actions";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/agent/dashboard", label: "ダッシュボード" },
  { href: "/agent/leads", label: "リード一覧" },
  { href: "/agent/settings", label: "対応エリア" }
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-beige-100">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-charcoal/10 bg-white/90 p-6 shadow-subtle md:flex">
        <div className="mb-10">
          <p className="text-lg font-semibold text-charcoal">OfferRoom for Agents</p>
          <p className="text-xs text-charcoal/60">Lead Management Console</p>
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl px-4 py-3 text-sm font-medium text-charcoal/70 transition hover:bg-gold/15 hover:text-charcoal">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAgent} className="mt-6">
          <Button type="submit" variant="ghost" className="w-full justify-start text-sm text-charcoal/60">
            ログアウト
          </Button>
        </form>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl space-y-8">{children}</div>
      </main>
    </div>
  );
}
