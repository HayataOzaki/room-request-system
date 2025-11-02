import { NextResponse } from "next/server";
import { rentalRequestSchema } from "@/lib/validators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/mail";
import { CITY_OPTIONS, STATION_OPTIONS } from "@/lib/locations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const result = rentalRequestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: "入力内容に誤りがあります", errors: result.error.flatten() }, { status: 422 });
  }

  const data = result.data;

  try {
    const supabase = createSupabaseAdminClient();

    const siteUrl = process.env.SITE_URL ?? "https://offerroom.example";

    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          email: data.email,
          name: data.fullName,
          phone: data.phone
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (userError) throw userError;

    const { data: conditionRecord, error: conditionError } = await supabase
      .from("search_conditions")
      .insert({
        user_id: userRecord.id,
        city_id: data.cityId,
        station_id: data.stationId ?? null,
        rent_max: data.rentMax,
        area_min: data.areaMin ?? null,
        area_max: data.areaMax ?? null,
        madori: data.layout,
        walk_minutes: data.walkMinutes,
        note: data.note ?? null
      })
      .select("id")
      .single();

    if (conditionError) throw conditionError;

    const city = CITY_OPTIONS.find((option) => option.id === data.cityId)?.name ?? data.cityId;
    const station = data.stationId
      ? STATION_OPTIONS.find((option) => option.id === data.stationId)?.name ?? data.stationId
      : "指定なし";

    const { data: agents, error: agentError } = await supabase
      .from("real_estate_agents")
      .select("id, email, company_name, is_approved, service_city_ids, service_station_ids")
      .eq("is_approved", true);

    if (agentError) throw agentError;

    const matchedAgents = (agents ?? []).filter((agent) => {
      const serviceCities: string[] = agent.service_city_ids ?? [];
      const serviceStations: string[] = agent.service_station_ids ?? [];
      const matchesCity = serviceCities.includes(data.cityId);
      const matchesStation = data.stationId ? serviceStations.includes(data.stationId) : true;
      return matchesCity && matchesStation;
    });

    if (matchedAgents.length) {
      const leadRows = matchedAgents.map((agent) => ({
        agent_id: agent.id,
        search_condition_id: conditionRecord.id
      }));
      const { error: leadError } = await supabase.from("leads").insert(leadRows);
      if (leadError) throw leadError;

      const agentEmails = matchedAgents.map((agent) => agent.email);
      await sendEmail({
        to: agentEmails,
        subject: "【OfferRoom】新しいリードが届きました",
        html: `新しい希望条件リクエストが届きました。<br/>エリア: ${city}<br/>希望駅: ${station}<br/>家賃上限: ${data.rentMax.toLocaleString()}円<br/><br/><a href="${siteUrl}/agent/leads">ダッシュボードで詳細を確認する</a>`
      });
    }

    await sendEmail({
      to: data.email,
      subject: "【OfferRoom】リクエストを受け付けました",
      html: `ご入力いただいた条件を受け付けました。<br/>エリア: ${city}<br/>希望駅: ${station}<br/><br/>担当者からの連絡をお待ちください。`
    });

    return NextResponse.json({ success: true, matchedAgents: matchedAgents.length });
  } catch (error: any) {
    console.error("request submission error", error);
    return NextResponse.json({ message: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
