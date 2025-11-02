"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { agentRegistrationSchema, agentLoginSchema } from "@/lib/validators";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/mail";

export async function registerAgent(prevState: any, formData: FormData) {
  const raw = {
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    password: formData.get("password"),
    serviceCities: formData.getAll("serviceCities") ?? [],
    serviceStations: formData.getAll("serviceStations") ?? []
  };

  const parsed = agentRegistrationSchema.safeParse({
    companyName: raw.companyName,
    email: raw.email,
    password: raw.password,
    serviceCities: (raw.serviceCities as string[]).filter(Boolean),
    serviceStations: (raw.serviceStations as string[]).filter(Boolean)
  });

  if (!parsed.success) {
    return { success: false, message: "入力内容を確認してください" };
  }

  try {
    const supabase = createSupabaseAdminClient();

    const existing = await supabase
      .from("real_estate_agents")
      .select("id")
      .eq("email", parsed.data.email)
      .maybeSingle();

    if (existing.data) {
      return { success: false, message: "このメールアドレスは既に登録済みです" };
    }

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        companyName: parsed.data.companyName
      }
    });

    if (authError) throw authError;

    const { error: insertError } = await supabase.from("real_estate_agents").insert({
      id: authUser.user?.id,
      company_name: parsed.data.companyName,
      email: parsed.data.email,
      is_approved: false,
      service_city_ids: parsed.data.serviceCities,
      service_station_ids: parsed.data.serviceStations
    });

    if (insertError) throw insertError;

    await sendEmail({
      to: parsed.data.email,
      subject: "【OfferRoom】登録申請を受け付けました",
      html: "審査完了後、ダッシュボードへのログインが可能になります。"
    });

    return { success: true };
  } catch (error: any) {
    console.error("registerAgent", error);
    return { success: false, message: "サーバーエラーが発生しました" };
  }
}

export async function loginAgent(prevState: any, formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password")
  };
  const parsed = agentLoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: "入力内容を確認してください" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { success: false, message: "ログインに失敗しました" };
  }
  revalidatePath("/agent/dashboard");
  return { success: true };
}

export async function logoutAgent() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/agent/login");
}
