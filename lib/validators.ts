import { z } from "zod";

export const rentalRequestSchema = z.object({
  fullName: z.string().min(1, "氏名は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phone: z.string().min(8, "電話番号を入力してください"),
  preferredContact: z.enum(["email", "phone"]),
  cityId: z.string().min(1, "市区町村を選択してください"),
  stationId: z.string().optional(),
  rentMax: z.number().min(10000).max(1000000),
  areaMin: z.number().optional(),
  areaMax: z.number().optional(),
  layout: z.string().min(1, "間取りを選択してください"),
  walkMinutes: z.number().min(1).max(60),
  note: z.string().max(800).optional()
});

export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;

export const agentRegistrationSchema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  serviceCities: z.array(z.string()).min(1, "対応エリアを選択してください"),
  serviceStations: z.array(z.string()).optional()
});

export type AgentRegistrationInput = z.infer<typeof agentRegistrationSchema>;

export const agentLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type AgentLoginInput = z.infer<typeof agentLoginSchema>;

export const areaUpdateSchema = z.object({
  serviceCities: z.array(z.string()),
  serviceStations: z.array(z.string())
});

export type AreaUpdateInput = z.infer<typeof areaUpdateSchema>;
