"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { areaUpdateSchema } from "@/lib/validators";

export async function updateAgentAreas(prevState: any, formData: FormData) {
  const serviceCities = formData.getAll("serviceCities").filter(Boolean) as string[];
  const serviceStations = formData.getAll("serviceStations").filter(Boolean) as string[];

  const parsed = areaUpdateSchema.safeParse({ serviceCities, serviceStations });
  if (!parsed.success) {
    return { success: false, message: "入力内容を確認してください" };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, message: "ログインしてください" };
  }

  const { error } = await supabase
    .from("real_estate_agents")
    .update({
      service_city_ids: parsed.data.serviceCities,
      service_station_ids: parsed.data.serviceStations
    })
    .eq("id", session.user.id);

  if (error) {
    return { success: false, message: "更新に失敗しました" };
  }

  revalidatePath("/agent/settings");
  return { success: true };
}
