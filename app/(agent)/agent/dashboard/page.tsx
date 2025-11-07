import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import dayjs from "dayjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AgentDashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/agent/login");
  }

  const { data: agent, error: agentError } = await supabase
    .from("real_estate_agents")
    .select("id, company_name, is_approved")
    .eq("id", session.user.id)
    .single();

  if (agentError || !agent) {
    redirect("/agent/login");
  }

  const { data: leadStats } = await supabase
    .from("leads")
    .select("is_viewed, created_at")
    .eq("agent_id", agent.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const totalLeads = leadStats?.length ?? 0;
  const viewedCount = leadStats?.filter((lead) => lead.is_viewed).length ?? 0;
  const latestLeadDate = leadStats?.[0]?.created_at
    ? dayjs(leadStats?.[0]?.created_at).format("YYYY/MM/DD HH:mm")
    : "-";

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-charcoal/10 bg-white/90 p-8 shadow-subtle">
        <h1 className="text-2xl font-semibold text-charcoal">こんにちは、{agent.company_name} 様</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          {agent.is_approved
            ? "最新のリード状況を確認できます。"
            : "現在審査中です。審査完了後にリードが配信されます。"}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>受信済みリード</CardDescription>
            <CardTitle className="text-3xl">{totalLeads}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>閲覧済み</CardDescription>
            <CardTitle className="text-3xl">{viewedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>最新受信日時</CardDescription>
            <CardTitle className="text-xl">{latestLeadDate}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>次のアクション</CardTitle>
          <CardDescription>リード一覧から詳細を確認し、コンタクト状況を管理しましょう。</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/agent/leads">リード一覧を確認</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
