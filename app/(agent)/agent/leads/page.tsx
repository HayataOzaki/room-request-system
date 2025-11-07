import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { CITY_OPTIONS, STATION_OPTIONS } from "@/lib/locations";

export default async function AgentLeadsPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/agent/login");
  }

  const { data: leads } = await supabase
    .from("leads")
    .select(
      "id, is_viewed, created_at, search_conditions(id, rent_max, madori, walk_minutes, city_id, station_id, users(name, email)))"
    )
    .eq("agent_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">リード一覧</h1>
        <p className="mt-2 text-sm text-charcoal/70">最新の希望条件リードを確認できます。</p>
      </div>
      <div className="space-y-4">
        {(leads ?? []).map((lead) => {
          const cityName = CITY_OPTIONS.find((city) => city.id === lead.search_conditions?.city_id)?.name;
          const stationName = lead.search_conditions?.station_id
            ? STATION_OPTIONS.find((station) => station.id === lead.search_conditions?.station_id)?.name
            : undefined;
          const rentMaxDisplay =
            typeof lead.search_conditions?.rent_max === "number"
              ? lead.search_conditions?.rent_max?.toLocaleString()
              : lead.search_conditions?.rent_max ?? "-";
          return (
          <div key={lead.id} className="rounded-3xl border border-charcoal/10 bg-white/80 p-6 shadow-subtle">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-charcoal">
                  {lead.search_conditions?.users?.name ?? "非公開"}
                </p>
                <p className="text-xs text-charcoal/50">受信: {dayjs(lead.created_at).format("YYYY/MM/DD HH:mm")}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-charcoal/70">
                  <span className="rounded-full bg-beige-50 px-3 py-1">エリア: {cityName ?? lead.search_conditions?.city_id}</span>
                  {stationName ? (
                    <span className="rounded-full bg-beige-50 px-3 py-1">希望駅: {stationName}</span>
                  ) : null}
                  <span className="rounded-full bg-beige-50 px-3 py-1">家賃上限: {rentMaxDisplay}円</span>
                  <span className="rounded-full bg-beige-50 px-3 py-1">間取り: {lead.search_conditions?.madori}</span>
                  <span className="rounded-full bg-beige-50 px-3 py-1">徒歩: {lead.search_conditions?.walk_minutes}分以内</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${lead.is_viewed ? "text-charcoal/50" : "text-gold"}`}>
                  {lead.is_viewed ? "既読" : "未読"}
                </span>
                <Button asChild variant="secondary">
                  <Link href={`/agent/leads/${lead.id}`}>詳細を見る</Link>
                </Button>
              </div>
            </div>
          </div>
        );
        })}
        {!leads?.length && (
          <div className="rounded-3xl border border-dashed border-charcoal/20 bg-white/60 p-12 text-center text-sm text-charcoal/60">
            まだリードは届いていません。対応エリアを広げるとマッチング数が増える可能性があります。
          </div>
        )}
      </div>
    </div>
  );
}
