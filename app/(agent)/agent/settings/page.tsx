import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SettingsForm from "./settings-form";

export default async function AgentSettingsPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/agent/login");
  }

  const { data: agent } = await supabase
    .from("real_estate_agents")
    .select("service_city_ids, service_station_ids")
    .eq("id", session.user.id)
    .single();

  return (
    <SettingsForm initialCities={agent?.service_city_ids ?? []} initialStations={agent?.service_station_ids ?? []} />
  );
}
