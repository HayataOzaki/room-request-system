# OfferRoom (room-request-system)

逆リクエスト型の賃貸リードマッチングSaaSのMVP実装です。入居希望者の希望条件を基に、対応エリアの不動産会社へ自動でリード通知を行います。不動産会社はダッシュボードでリードを閲覧し、対応状況を管理できます。

## 機能概要

### 入居希望者向け
- ステップ形式の希望条件フォーム（基本情報 → エリア → 条件 → 確認）
- 確認画面 / 完了画面
- リクエスト送信時に Supabase へデータ保存 & SendGrid 経由で通知メール送信

### 不動産会社向け
- 審査制を想定したアカウント登録（サービスロールキーでアカウントを発行し、初期状態は未承認）
- メール+パスワードによるログイン（Supabase Auth）
- ダッシュボード（受信リード数 / 閲覧数 / 最新受信日時）
- リード一覧 / 詳細表示（閲覧時に既読化）
- 対応エリア設定の更新フォーム
- ログアウト

## 技術スタック

| Layer | Stack |
| --- | --- |
| Framework | Next.js 14 (App Router, TypeScript) |
| UI | Tailwind CSS, カスタム shadcn 風 UI コンポーネント, Lucide Icons |
| Auth / DB | Supabase Auth, Supabase Postgres (REST API) |
| Validation | Zod, React Hook Form |
| Mail | SendGrid |

## ディレクトリ構成

```
app/
  ├─ (auth)/agent/...   # 不動産会社の登録 / ログイン
  ├─ (agent)/agent/...  # ログイン後のダッシュボード
  ├─ form/...           # 入居希望フォーム一式
  ├─ api/requests/      # 希望条件送信 API
  └─ ...
components/             # UI コンポーネント
lib/                    # Supabase クライアント, バリデーション, メールユーティリティ
supabase/schema.sql     # 必要なテーブル定義
```

## セットアップ

### 事前準備（初回のみ）

macOS のように標準で `npm` が入っていない環境では、まず Node.js をインストールしてください。推奨バージョンは 18 以上です。

- **Homebrew を利用する場合**
  ```bash
  brew install node
  ```
- **nvm を利用する場合**
  ```bash
  # nvm のインストール（未導入の場合）
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  # シェルを再読み込みしてから Node.js を導入
  nvm install --lts
  ```

`node -v` と `npm -v` が表示されれば準備完了です。

1. リポジトリへ移動して依存関係をインストール
   ```bash
   # まだクローンしていない場合
   git clone https://github.com/HayataOzaki/room-request-system.git
   cd room-request-system

   # Node.js / npm のバージョンを確認
   node -v
   npm -v

   # パッケージをインストール
   npm install
   ```
   ※ 現在の開発環境では npm registry へのアクセス制限があるため失敗する場合があります。ローカルでは問題なくインストールできます。

2. 環境変数の設定
   ```bash
   cp .env.example .env

   # エディタで .env を開いて値を入力
   code .env      # VS Code の場合
   # もしくは
   nano .env
   ```
   `.env` に以下を設定します。
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SENDGRID_API_KEY`
   - `SYSTEM_FROM_EMAIL`
   - `SITE_URL` (メール本文に利用)

3. Supabase のセットアップ
   ```bash
   # Supabase CLI が未インストールの場合
   npm install -g supabase

   # ログイン（ブラウザが開きます）
   supabase login

   # 対象プロジェクトを選択してスキーマを適用
   supabase db push --file supabase/schema.sql
   ```
   - CLI を利用しない場合は、Supabase ダッシュボードの SQL エディタで `supabase/schema.sql` の内容を貼り付けて実行します。
   - Authentication > Email templates を必要に応じて調整してください。
   - RLS を使用する場合は、各テーブルに適切なポリシーを設定してください（MVP ではサービスロールキー経由で操作します）。

4. 開発サーバーを起動
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:3000` を開き、入居希望者フォームと不動産会社向けダッシュボードを確認します。初回アクセス時は Supabase の認証メールが届くため、招待したアカウントを有効化してください。

## Supabase スキーマ

`supabase/schema.sql` に、以下のテーブル定義が含まれます。

- `users`
- `search_conditions`
- `real_estate_agents`
- `leads`

`real_estate_agents.is_approved` を true にするとリード配信対象となります。

## メール送信

`lib/mail.ts` で SendGrid を利用しています。`SENDGRID_API_KEY` 未設定の場合は送信をスキップし、サーバーログにメッセージを出力します。

## 開発メモ

- UI は Trust Beige カラーパレットをベースに、余白と角丸を大きめに取ったミニマルなデザインです。
- 入居希望フォームは sessionStorage を使用して確認画面へデータを受け渡しています。
- 不動産会社向けページは Supabase セッションを利用して保護しており、未ログイン時は `/agent/login` へリダイレクトされます。

## ライセンス

MIT
