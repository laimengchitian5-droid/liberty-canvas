# LibertyCanvas — ワンタップ・スコープメニュー

## 完了済み

| Phase | 内容 |
|-------|------|
| 0–1 | Core + i18n + Discover + SEO Query |
| 2 | Scoring + Design tokens + Insights + Builder v2 |
| 3 | SEO v3 + Query + Edge + i18n resultLocales |
| 4 | SearchPort + Postgres FTS + Vector hybrid + Log analytics + Scoring port |
| 5 | Rubel→Plug bridge + Observability + mobile locale fix |

---

## Phase 6 — GSC 駆動（2026-07 データ反映）

**GSC ファクト:** Clicks 9 / Impressions 48 / CTR 18.8% / Pos 32.2  
**Top queries:** `libertycanvas`, `mbti test free`, `9エニア デルタタイプ診断`, `mbti generator`  
**Top pages:** `/discover/en/mbti-personality-types`, `/discover/ja/enneagram-nine-types`, `/diagnosis/enneagram?lang=ko`  
**リスク:** 商標語（MBTI® / Enneagram / 16Personalities / INFP 等）が landing copy・schema・searchTags に残存 → **URL 削除不可・文言差し替え必須**

### 推奨キュー（優先順）

| タップキーワード | スコープ | 工数目安 | GSC 直結 |
|------------------|----------|----------|----------|
| **`6A`** | Legal SEO Shield | 1–2d | ★★★ 商標リスク即時低減 |
| **`6B`** | Legacy Route Matrix | 0.5–1d | ★★★ `/diagnosis/enneagram?lang=*` 404 防止 |
| **`6C`** | Lifestyle 30Q | 2–3d | ★★ 滞在・CWV・再訪 |
| **`6D`** | JA UX Purge | 1–2d | ★★ 混合言語排除 |
| **`6E`** | Cosmic Planet CSS v2 | 1–2d | ★ 差別化・シェア |
| **`6F`** | Builder Blocks Zustand | 2–4d | ★ クリエイター成長 |
| **`Phase 6 全部`** | 6A→6F 一括 | 1–2wk | フルロードマップ |
| **`6A+6B 緊急`** | 法務+ルーティングのみ | 1–2d | **今週推奨** |

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

## その他

| キーワード | 内容 |
|------------|------|
| **`Postgres プロビジョン`** | Vercel Postgres + 初回 reindex |
| **`本番デプロイ`** | vercel deploy --prod |
| **`GSC 再検査`** | URL 検査リスト（チャット履歴参照） |

*Phase 4: POSTGRES_URL 未設定時 token フォールバック*  
*Phase 5: LC_RUBEL_CONVERGE 未設定時 /play 非破壊*  
*Phase 6: **ページ削除禁止** — slug 権威温存 + 文言 Strangler*
