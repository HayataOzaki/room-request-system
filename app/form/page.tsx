"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rentalRequestSchema, type RentalRequestInput } from "@/lib/validators";
import { CITY_OPTIONS, STATION_OPTIONS, LAYOUT_OPTIONS } from "@/lib/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "基本情報" },
  { id: 2, title: "エリア" },
  { id: 3, title: "ご希望条件" },
  { id: 4, title: "確認" }
];

export default function RentalFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const {
    register,
    control,
    watch,
    trigger,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RentalRequestInput>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: {
      preferredContact: "email",
      walkMinutes: 10,
      rentMax: 120000,
      layout: "1LDK"
    }
  });

  const watchCity = watch("cityId");

  useEffect(() => {
    const stored = sessionStorage.getItem("rental-request");
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<RentalRequestInput>;
      Object.entries(parsed).forEach(([key, value]) => {
        setValue(key as keyof RentalRequestInput, value as never);
      });
    }
  }, [setValue]);

  const availableStations = useMemo(
    () => STATION_OPTIONS.filter((station) => station.cityId === watchCity),
    [watchCity]
  );

  const persistAndGoNext = async () => {
    const requiredFieldsByStep: Record<number, (keyof RentalRequestInput)[]> = {
      1: ["fullName", "email", "phone", "preferredContact"],
      2: ["cityId"],
      3: ["rentMax", "layout", "walkMinutes"],
      4: []
    };
    const fields = requiredFieldsByStep[step];
    const valid = await trigger(fields);
    if (!valid) {
      toast({ title: "入力内容を確認してください" });
      return;
    }
    setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const onSubmit = (data: RentalRequestInput) => {
    sessionStorage.setItem("rental-request", JSON.stringify(data));
    router.push("/form/confirm");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12 space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">STEP FORM</p>
        <h1 className="text-3xl font-semibold text-charcoal">希望条件を入力</h1>
        <p className="text-sm text-charcoal/70">所要時間 約3分。入力内容は確認画面で変更できます。</p>
      </div>
      <div className="mb-10 flex flex-col items-center gap-6 md:flex-row md:justify-center">
        {steps.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step >= item.id ? "border-gold bg-gold text-white" : "border-charcoal/20 text-charcoal/40"
              }`}
            >
              {item.id}
            </span>
            <span className={`text-sm font-medium ${step >= item.id ? "text-charcoal" : "text-charcoal/40"}`}>
              {item.title}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {step === 1 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">氏名</Label>
              <Input id="fullName" placeholder="山田 太郎" {...register("fullName")}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" placeholder="example@mail.com" {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input id="phone" placeholder="09012345678" {...register("phone")}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredContact">希望連絡手段</Label>
              <Select id="preferredContact" {...register("preferredContact")}>
                <option value="email">メールで連絡</option>
                <option value="phone">電話で連絡</option>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cityId">希望エリア</Label>
              <Select id="cityId" {...register("cityId")}
                aria-invalid={!!errors.cityId}
              >
                <option value="">選択してください</option>
                {CITY_OPTIONS.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Select>
              {errors.cityId && <p className="text-xs text-red-500">{errors.cityId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stationId">最寄り希望駅 (任意)</Label>
              <Controller
                control={control}
                name="stationId"
                render={({ field }) => (
                  <Select
                    id="stationId"
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value || undefined)}
                  >
                    <option value="">指定なし</option>
                    {availableStations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rentMax">希望家賃 (上限)</Label>
              <Input
                id="rentMax"
                type="number"
                min={10000}
                step={5000}
                placeholder="120000"
                {...register("rentMax", { valueAsNumber: true })}
                aria-invalid={!!errors.rentMax}
              />
              {errors.rentMax && <p className="text-xs text-red-500">{errors.rentMax.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="walkMinutes">駅徒歩 (最大分数)</Label>
              <Input
                id="walkMinutes"
                type="number"
                min={1}
                max={60}
                step={1}
                {...register("walkMinutes", { valueAsNumber: true })}
                aria-invalid={!!errors.walkMinutes}
              />
              {errors.walkMinutes && <p className="text-xs text-red-500">{errors.walkMinutes.message}</p>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="layout">希望間取り</Label>
              <Select id="layout" {...register("layout")}>
                {LAYOUT_OPTIONS.map((layout) => (
                  <option key={layout.value} value={layout.value}>
                    {layout.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaMin">専有面積 (最小 m²)</Label>
              <Input id="areaMin" type="number" {...register("areaMin", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaMax">専有面積 (最大 m²)</Label>
              <Input id="areaMax" type="number" {...register("areaMax", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">こだわり条件 (任意)</Label>
              <Textarea id="note" rows={4} placeholder="例: ペット可、2人入居、在宅勤務スペースが欲しい" {...register("note")} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-3xl border border-charcoal/10 bg-white/80 p-8 shadow-subtle">
            <h2 className="text-xl font-semibold text-charcoal">入力内容の確認</h2>
            <p className="mt-2 text-sm text-charcoal/70">この内容で送信すると確認画面へ進みます。</p>
            <div className="mt-6 grid gap-4 text-sm text-charcoal/80 md:grid-cols-2">
              {Object.entries(watch()).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-charcoal/50">{key}</p>
                  <p className="rounded-2xl bg-beige-50 px-4 py-2">{String(value ?? "-")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
          >
            戻る
          </Button>
          {step < steps.length ? (
            <Button type="button" onClick={persistAndGoNext}>
              次へ進む
            </Button>
          ) : (
            <Button type="submit">確認画面へ</Button>
          )}
        </div>
      </form>
    </div>
  );
}
