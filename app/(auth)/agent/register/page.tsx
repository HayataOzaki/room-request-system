"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { registerAgent } from "../actions";
import { CITY_OPTIONS, STATION_OPTIONS } from "@/lib/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useState } from "react";

const initialState = { success: false, message: "" };

export default function AgentRegisterPage() {
  const [state, formAction] = useFormState(registerAgent, initialState);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const stations = STATION_OPTIONS.filter((station) => station.cityId === selectedCity);

  return (
    <div className="w-full max-w-lg rounded-3xl border border-charcoal/10 bg-white/80 p-10 shadow-subtle">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-charcoal">不動産会社アカウント登録</h1>
        <p className="text-sm text-charcoal/70">審査通過後にダッシュボードへアクセスできます。</p>
      </div>
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">会社名 / 店舗名</Label>
          <Input id="companyName" name="companyName" placeholder="株式会社サンプル不動産" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">担当者メール</Label>
          <Input id="email" name="email" type="email" placeholder="agent@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" name="password" type="password" minLength={6} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceCities">対応エリア</Label>
          <Select
            id="serviceCities"
            name="serviceCities"
            required
            onChange={(event) => setSelectedCity(event.target.value)}
          >
            <option value="">選択してください</option>
            {CITY_OPTIONS.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
          <p className="text-xs text-charcoal/50">複数エリア対応の場合は申請後サポートまでお問い合わせください。</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceStations">対応駅 (任意)</Label>
          <Select id="serviceStations" name="serviceStations" multiple size={stations.length ? Math.min(4, stations.length) : 2}>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </Select>
        </div>
        {state.message && !state.success ? (
          <p className="text-sm text-red-500">{state.message}</p>
        ) : null}
        {state.success ? (
          <p className="rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">
            登録申請を受け付けました。審査完了までお待ちください。
          </p>
        ) : null}
        <Button type="submit" className="w-full">
          登録申請を送信
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-charcoal/70">
        既にアカウントをお持ちですか？ <Link href="/agent/login" className="font-semibold text-gold">ログイン</Link>
      </p>
    </div>
  );
}
