# 🎯 Rent Offer Platform (仮称: OFFEROOM / OSHIROOM)

賃貸希望者が条件を入力すると、  
対応可能な不動産会社に自動でリードが届く **賃貸リードマッチングSaaS** の MVP。

> 入居希望者の「希望条件リクエスト」 → 不動産会社が受け取る  
従来の物件検索ではなく **逆リクエスト型賃貸サービス**。

---

## 🚀 目的

- 賃貸希望者は探さずに「希望条件を送るだけ」
- 不動産会社は自社エリアに合うリードを受信
- 公正・効率的なリード配信で成約率を向上

将来的には課金モデル（リード課金 / 閲覧課金 / サブスク＋従量）へ拡張。

---

## 🧭 コア機能（MVP）

### 👤 賃貸希望者側
- エリア・条件フォーム入力
- ステップ式UI
- 入力確認・送信
- 完了画面
- 自分宛の受付メール

### 🏢 不動産会社側
- アカウント登録・ログイン（審査制）
- 対応エリア登録（市区町村／駅）
- ダッシュボード
- リード一覧／詳細閲覧
- 閲覧ステータス（既読管理）

### ✉️ 通知
- 新規リード → 対応不動産会社へメール
- ユーザー受付メール

---

## 🛠️ 技術スタック

| レイヤ | 技術 |
|---|---|
Framework | **Next.js** (App Router / TypeScript)  
UI | **Tailwind CSS**, **shadcn/ui**, **Radix UI**, lucide-react  
Auth | **Supabase Auth**  
DB | **Supabase PostgreSQL + Prisma**  
Mail | **SendGrid**  
Deploy | **Vercel**  

---

## 🎨 UI/UX要件

| 項目 | 内容 |
|---|---|
スタイル | ミニマル × 信頼感 × 住宅Tech  
カラー | Trust Beige (#F5F2E9 / #1C1C1C / Gold #D4AF37)  
フォント | Inter + Noto Sans JP  
特徴 | 余白広め、角丸大、モーション控えめ、カード多用  
パターン | ステップフォーム、ダッシュボードUI  

---

## 📂 ページ構成

/ # LP
/form # 入居希望フォーム
/form/confirm # 確認
/thanks # 完了

/agent/register # 業者登録
/agent/login # ログイン
/agent/dashboard
/agent/leads
/agent/leads/:id
/agent/settings # 対応エリア

pgsql
コードをコピーする

---

## 🗄️ データモデル

### users（賃貸希望者）
| field | type |
|---|---|
id | uuid  
name | text  
email | text  
phone | text  
created_at | timestamp  

### search_conditions
| field | type |
|---|---|
id | uuid  
user_id | FK  
city_id | int  
station_id | int  
rent_max | numeric  
area_min / area_max | int  
madori | text  
walk_minutes | int  
created_at | timestamp  

### real_estate_agents
| field | type |
|---|---|
id | uuid  
company_name | text  
email | text  
is_approved | boolean  
service_city_ids | jsonb  
service_station_ids | jsonb  
created_at | timestamp  

### leads
| field | type |
|---|---|
id | uuid  
search_condition_id | FK  
agent_id | FK  
is_viewed | boolean  
viewed_at | timestamp  
created_at | timestamp  

---

## 🔁 基本フロー

User submits conditions
↓
Match agents by city/station
↓
Generate leads records
↓
Send email to matched agents
↓
Agent logs in → views lead
↓
Mark viewed → future billing logic

yaml
コードをコピーする

---

## ✅ MVPスコープ

- [x] 入居希望フォーム
- [x] Supabase Auth for agents
- [x] 審査フラグ(is_approved)
- [x] リード生成・通知
- [x] ダッシュボード
- [x] リード閲覧状態管理

---

## 🧪 非スコープ（後で対応）

- 決済（Stripe）
- LINE通知
- 物件添付
- ユーザー管理画面
- 管理者UI

---

## 🚧 開発ガイド

UI scaffold with shadcn

Auth / session guard

Prisma schema → migrate

Form + validation

Email flow

Dashboard & views

Deploy on Vercel

yaml
コードをコピーする

---

## 🌱 ローカルセットアップ

npm i
cp .env.example .env

Set SUPABASE_URL / KEY / SENDGRID_KEY
npm run dev

yaml
コードをコピーする

---

## 📜 ライセンス

MIT (変更可)

---

## ✨ Author

Startup builder / property & UX direction by **@あなた**  
AI coding support via **Codex + ChatGPT**

---
