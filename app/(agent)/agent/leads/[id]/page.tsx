import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import dayjs from "dayjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CITY_OPTIONS, STATION_OPTIONS } from "@/lib/locations";

interface Params {
  params: { id: string };
}

export default async function LeadDetailPage({ params }: Params) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/agent/login");
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select(
      "id, is_viewed, viewed_at, created_at, search_conditions(*, users(*))"
    )
    .eq("id", params.id)
    .eq("agent_id", session.user.id)
    .maybeSingle();

  if (error || !lead) {
    redirect("/agent/leads");
  }

  if (!lead.is_viewed) {
    await supabase
      .from("leads")
      .update({ is_viewed: true, viewed_at: new Date().toISOString() })
      .eq("id", lead.id);
  }

  const condition = lead.search_conditions;
  const user = condition?.users;
  const city = CITY_OPTIONS.find((option) => option.id === condition?.city_id)?.name ?? condition?.city_id;
  const station = condition?.station_id
    ? STATION_OPTIONS.find((option) => option.id === condition.station_id)?.name ?? condition.station_id
    : "指定なし";
  const rentMaxDisplay =
    typeof condition?.rent_max === "number"
      ? condition.rent_max.toLocaleString()
      : (condition?.rent_max as string | undefined) ?? "-";
  const areaRange = `${condition?.area_min ?? "-"} ~ ${condition?.area_max ?? "-"} m²`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">リード詳細</h1>
        <p className="text-sm text-charcoal/60">受信日時: {dayjs(lead.created_at).format("YYYY/MM/DD HH:mm")}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>入居希望者情報</CardTitle>
          <CardDescription>必要に応じて直接ご連絡ください。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-charcoal/80">
          <div>
            <p className="text-xs uppercase tracking-wider text-charcoal/50">氏名</p>
            <p className="mt-1 text-base text-charcoal">{user?.name ?? "非公開"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-charcoal/50">メール</p>
            <p className="mt-1 text-base text-charcoal">{user?.email ?? "-"}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>希望条件</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <InfoItem label="エリア" value={city ?? "-"} />
          <InfoItem label="希望駅" value={station} />
          <InfoItem label="家賃上限" value={`${rentMaxDisplay} 円`} />
          <InfoItem label="希望間取り" value={condition?.madori ?? "-"} />
          <InfoItem label="駅徒歩" value={`${condition?.walk_minutes ?? "-"} 分以内`} />
          <InfoItem label="専有面積" value={areaRange} />
          <div className="md:col-span-2">
            <InfoItem label="こだわり条件" value={condition?.note ?? "特になし"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-3xl border border-charcoal/10 bg-white/80 p-4">
      <p className="text-xs uppercase tracking-wider text-charcoal/50">{label}</p>
      <p className="text-base text-charcoal">{value}</p>
    </div>
  );
}
