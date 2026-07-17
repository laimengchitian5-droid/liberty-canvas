# LibertyCanvas — ワンタップ・スコープメニュー

## 完了済み

| Phase | 内容                                                                     |
| ----- | ------------------------------------------------------------------------ |
| 0–1   | Core + i18n + Discover + SEO Query                                       |
| 2     | Scoring + Design tokens + Insights + Builder v2                          |
| 3     | SEO v3 + Query + Edge + i18n resultLocales                               |
| 4     | SearchPort + Postgres FTS + Vector hybrid + Log analytics + Scoring port |
| 5     | Rubel→Plug bridge + Observability + mobile locale fix                    |

---

## Phase 6 — GSC 駆動（2026-07 データ反映）

**GSC ファクト:** Clicks 9 / Impressions 48 / CTR 18.8% / Pos 32.2  
**Top queries:** `libertycanvas`, `mbti test free`, `9エニア デルタタイプ診断`, `mbti generator`  
**Top pages:** `/discover/en/mbti-personality-types`, `/discover/ja/enneagram-nine-types`, `/diagnosis/enneagram?lang=ko`  
**リスク:** 商標語（MBTI® / Enneagram / 16Personalities / INFP 等）が landing copy・schema・searchTags に残存 → **URL 削除不可・文言差し替え必須**

### 推奨キュー（優先順）

| タップキーワード   | スコープ               | 工数目安 | GSC 直結                                   |
| ------------------ | ---------------------- | -------- | ------------------------------------------ |
| **`6A`**           | Legal SEO Shield       | 1–2d     | ★★★ 商標リスク即時低減                     |
| **`6B`**           | Legacy Route Matrix    | 0.5–1d   | ★★★ `/diagnosis/enneagram?lang=*` 404 防止 |
| **`6C`**           | Lifestyle 30Q          | 2–3d     | ★★ 滞在・CWV・再訪                         |
| **`6D`**           | JA UX Purge            | 1–2d     | ★★ 混合言語排除                            |
| **`6E`**           | Cosmic Planet CSS v2   | 1–2d     | ★ 差別化・シェア                           |
| **`6F`**           | Builder Blocks Zustand | 2–4d     | ★ クリエイター成長                         |
| **`Phase 6 全部`** | 6A→6F 一括             | 1–2wk    | フルロードマップ                           |
| **`6A+6B 緊急`**   | 法務+ルーティングのみ  | 1–2d     | **✅ 完了 `d4ebfe9`**                      |

### ワンタップ詳細

#### `6A` — Legal SEO Shield（商標インスレーション）

- **目的:** URL/slug **非破壊**のまま、公開文言・Schema・OG・searchTags から商標語を学術安全語に置換
- **触る:** `landingCopy.ts`, `landingTopics.ts`, `psychSeo.ts`, `rubelSeo.ts`, `searchIntent.ts`, `buildPlugDiagnosisMetadata.ts`
- **手法:** Strangler — slug `mbti-personality-types` は維持、H1/title/schema を「5因子・動機スペクトル・Liberty タイプ」へ。FAQ に非公式 disclaimer。4文字型（INFP 等）全面禁止
- **完了条件:** `rg -i 'mbti|enneagram|16personalities|INFP' src/lib/landing src/lib/seo` → 公開面ゼロ（テスト fixture 除く）+ GSC 再クロール

#### `6B` — Legacy Route Matrix（国際 301 網）

- **目的:** GSC 流入 URL を Plug canonical へ 301、`?lang=` 保持
- **触る:** `next.config.mjs`, `middleware.ts`, `psychSeo.ts`
- **追加 redirect 例:** `/diagnosis/enneagram`, `/diagnosis/big-five`, `/diagnosis/:topic`, `/discover/*/mbti-*` → 対応 Plug play + ref=gsc-legacy
- **完了条件:** 上記 URL が 301 + query 保持、Playwright smoke

#### `6C` — Lifestyle 30Q（推し活・恋愛・Gen-Z）

- **現状:** oshikatsu / romance / genz = **各24問**（`diagnosisQuestionBanks.ts`）
- **目的:** 各 **28–30問** + ファネル計測
- **触る:** `diagnosisQuestionBanks.ts`, `diagnoses.ts`, `DiagnosisCompiler` progress UX
- **完了条件:** 3 slug × ≥28問 + `npm run ci`

#### `6D` — JA UX Purge（100% 自然な日本語）

- **目的:** ボタン・ローダー・エラー・AI プロンプトの日英混在排除
- **触る:** `messages.ts`, `resultLocalesCore.ts`, `DiagnosisCompiler`, `RubelPlayCore`, `BuilderStudio`
- **完了条件:** JA locale で英語断片 grep ゼロ（固有名・locale ラベル除く）

#### `6E` — Cosmic Planet CSS v2（5因子連動ビジュアル）

- **現状:** `cosmicPlanetEngine.ts` + OG 連動済み
- **目的:** `DiagnosisResultPage` で Tailwind/SVG 惑星が **Big Five ベクトルで形状・色・リング数が連続変化**
- **触る:** `cosmicPlanetEngine.ts`, 新 `CosmicPlanetVisualizer.tsx`, `DiagnosisResultPage.tsx`
- **完了条件:** 5因子 extreme で visual regression 3パターン + a11y

#### `6F` — Builder Blocks Zustand（No-Code モジュール）

- **現状:** `CONDITIONAL_BRANCH` + `BuilderStudio` 部分実装
- **目的:** ブロック追加・分岐・AI affirmation popup を Zustand store で完結
- **触る:** `builderSchema.ts`, `builderDraftStorage`, 新 `builderStore.ts`, `BuilderStudio.tsx`
- **完了条件:** ブロック D&D + 分岐 + プレビュー + 既存 publish パイプライン非破壊

---

_Phase 6: **ページ削除禁止** — slug 権威温存 + 文言 Strangler_

---

## Phase 7 — 国際クリック × 言語統合（GSC プロパティ修正後）

**状況（2026-07-12）:** 6A+6B 本番反映済み（`d4ebfe9` / `dpl_6mPPK9xritcje3Zf8Bhinm3nf1xP`）  
**GSC 障害:** 「URL がプロパティ内にありません」→ **相対パス不可・プロパティ URL と完全一致必須**  
**新要件:** 多国検索流入 → **実クリック・診断開始**まで。言語設定（8 locale UI vs 4 locale Discover、`?lang=` SSR 未同期）が弱点

### GSC 再検査 — 正しいフル URL（プロパティが `https://liberty-canvas.vercel.app` の場合）

| 用途                            | 貼り付ける URL                                                         |
| ------------------------------- | ---------------------------------------------------------------------- |
| EN landing（旧 mbti slug）      | `https://liberty-canvas.vercel.app/discover/en/mbti-personality-types` |
| JA landing（旧 enneagram slug） | `https://liberty-canvas.vercel.app/discover/ja/enneagram-nine-types`   |
| Legacy KO 流入                  | `https://liberty-canvas.vercel.app/diagnosis/enneagram?lang=ko`        |
| サイトマップ                    | `https://liberty-canvas.vercel.app/sitemap.xml`                        |
| ホーム                          | `https://liberty-canvas.vercel.app/`                                   |

**プロパティ不一致チェック:** Search Console 左上のプロパティ名が上記ドメインと一致しているか。`www` 有無・カスタムドメイン・別 Vercel プレビュー URL だと全滅。**ドメインプロパティ**なら `liberty-canvas.vercel.app` 全体が対象（URL はフルで入力）。

### 推奨キュー（Principal Architect — クリック優先）

| タップキーワード   | スコープ                         | 工数   | クリック直結                             |
| ------------------ | -------------------------------- | ------ | ---------------------------------------- |
| **`7L 緊急`**      | Locale SSR Sync                  | 0.5–1d | ★★★ Discover `?lang=` → 初回表示が正言語 |
| **`7G`**           | GSC Property & Sitemap Ops       | 0.5d   | ★★★ インデックス・検査が通る状態に       |
| **`7F`**           | Discover→Play Funnel             | 1–2d   | ★★★ LP から診断開始率                    |
| **`7S`**           | SERP Click Pack（4 locale）      | 1–2d   | ★★ 表示→クリック CTR                     |
| **`7I`**           | International Discover（+fr/de） | 2–3d   | ★★ 新規国の LP 面                        |
| **`6D`**           | JA UX Purge                      | 1–2d   | ★★ JA 混合語排除                         |
| **`6C`**           | Lifestyle 30Q                    | 2–3d   | ★ 滞在・再訪                             |
| **`7L+7F 緊急`**   | 言語同期 + ファネル              | 1–2d   | **✅ 完了 `1432bd8`**                    |
| **`Phase 7 全部`** | 7G→7L→7F→7S→7I→6D                | 1–2wk  | フル国際化                               |

### ワンタップ詳細

#### `7G` — GSC Property & Sitemap Ops

- **目的:** 検査 URL が通るプロパティ整合 + クロール促進
- **触る:** 運用のみ（コード最小: `NEXT_PUBLIC_SITE_URL` 確認、`robots.ts` / `sitemap.ts` 検証）
- **手順:** プロパティ確認 → サイトマップ送信 → 上表フル URL で「URL 検査」→ インデックス登録リクエスト
- **完了条件:** 3 URL すべて「プロパティ内」+ サイトマップ成功

#### `7L` — Locale SSR Sync（言語の芯）

- **目的:** `/discover/ko/...` → `?lang=ko` 遷移後、**初回 SSR から韓国語 UI**（現状 cookie は response 側のみで layout が未読）
- **触る:** `layout.tsx`, `resolveAppLocale.ts`, `I18nProvider.tsx`, `middleware.ts`（`x-lc-locale` header 伝播）
- **手法:** layout が `headers().get("x-lc-locale")` を最優先。Discover path locale → play handoff で cookie + header 二重化
- **完了条件:** `?lang=ko` 初回アクセスで nav/診断 UI が KO（Accept-Language / JA デフォルトに落ちない）

#### `7F` — Discover→Play Funnel（クリック→開始）

- **目的:** 多国 SERP 流入者が **1 タップ以内で診断開始**
- **触る:** `LandingIntakeClient.tsx`, `DiagnosisCompiler`, `DiagnosisRefCapture`, analytics events
- **追加:** locale バッジ表示、CTA 文言を landing locale 固定、離脱前 sticky CTA、`ref=discover-{slug}` 計測ダッシュボード
- **完了条件:** Discover → play 遷移で locale/ref 100% 保持 + Insights に funnel 表示

#### `7S` — SERP Click Pack

- **目的:** 各国クエリ（`mbti test free`, `9エニア…`, `libertycanvas`）に合わせ title/description/OG を locale 別最適化
- **触る:** `legalSafeLandingCopy.ts`, `buildLandingMetadata`, `buildPlugDiagnosisMetadata`, OG API
- **完了条件:** 4 locale × top 3 slug で unique title、Rich Results Test 合格

#### `7I` — International Discover Expansion

- **目的:** fr/de/ar/he スイッチャー表示ユーザー向け LP（現状 Discover は en/ja/ko/zh のみ → **UI 8言語 / LP 4言語のギャップ**）
- **触る:** `landingLocales.ts`, `legalSafeLandingCopy.ts`, `sitemap.ts`, `messages.ts`（fr/de 部分翻訳）
- **選択:** A) fr/de LP 追加 B) 未対応 locale は en LP + hreflang 整理 C) スイッcher から fr/de/ar/he を一時非表示
- **完了条件:** スイッチャーで選んだ言語と LP/UI が矛盾しない

#### 継承（Phase 6 残）

- **`6D`** JA UX Purge — ボタン・ローダー・AI プロンプトの日英混在排除
- **`6C`** Lifestyle 30Q — oshikatsu/romance/genz 各 28–30 問

---

## その他

| キーワード                  | 内容                           |
| --------------------------- | ------------------------------ |
| **`Postgres プロビジョン`** | Vercel Postgres + 初回 reindex |
| **`本番デプロイ`**          | vercel deploy --prod           |
| **`GSC 再検査`**            | Phase 7 表のフル URL を使用    |

_Phase 4: POSTGRES_URL 未設定時 token フォールバック_  
_Phase 5: LC_RUBEL_CONVERGE 未設定時 /play 非破壊_  
_Phase 6: **ページ削除禁止** — slug 権威温存 + 文言 Strangler_
