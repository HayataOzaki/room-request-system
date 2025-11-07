"use client";

import { useFormState } from "react-dom";
import { updateAgentAreas } from "./actions";
import { CITY_OPTIONS, STATION_OPTIONS } from "@/lib/locations";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function SettingsForm({
  initialCities,
  initialStations
}: {
  initialCities: string[];
  initialStations: string[];
}) {
  const [state, formAction] = useFormState(updateAgentAreas, { success: false, message: "" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">対応エリアの設定</h1>
        <p className="mt-2 text-sm text-charcoal/70">希望条件のマッチングに使用されるエリア情報を更新できます。</p>
      </div>
      <form action={formAction} className="space-y-6 rounded-3xl border border-charcoal/10 bg-white/80 p-8 shadow-subtle">
        <div className="space-y-2">
          <Label htmlFor="serviceCities">対応市区町村</Label>
          <Select id="serviceCities" name="serviceCities" multiple defaultValue={initialCities} size={Math.min(5, CITY_OPTIONS.length)}>
            {CITY_OPTIONS.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceStations">対応駅</Label>
          <Select id="serviceStations" name="serviceStations" multiple defaultValue={initialStations} size={Math.min(6, STATION_OPTIONS.length)}>
            {STATION_OPTIONS.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </Select>
          <p className="text-xs text-charcoal/50">駅を指定しない場合は市区町村単位でマッチングが行われます。</p>
        </div>
        {state.message && !state.success ? <p className="text-sm text-red-500">{state.message}</p> : null}
        {state.success ? (
          <p className="rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">保存しました</p>
        ) : null}
        <Button type="submit">保存する</Button>
      </form>
    </div>
  );
}
