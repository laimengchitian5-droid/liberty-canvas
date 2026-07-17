# LibertyCanvas — 実装スコープマップ

Cursor **Settings → Rules** に表示される 9 ルールの早見表。

## ルール一覧

| ルール              | 自動適用     | 主な glob / 条件                                   |
| ------------------- | ------------ | -------------------------------------------------- |
| `project-core`      | **常時**     | 全体規約                                           |
| `master-architect`  | **常時**     | マスターペルソナ・出力規律・@context・Adult-Cute   |
| `scope-proposal`    | **常時**     | 実装前にスコープ提案を出す                         |
| `diagnosis-module`  | ファイル連動 | `diagnosis/**`, `useDiagnosis*`, `useAdviceStream` |
| `diagnosis-types`   | ファイル連動 | `types/diagnosis.ts`, `lib/diagnosis/**`           |
| `ai-streaming`      | ファイル連動 | `api/diagnosis/**`, advice hooks/prompts           |
| `ai-provider`       | ファイル連動 | `lib/ai/**`, `api/chat/**`, `api/diagnosis/**`     |
| `w3c-accessibility` | ファイル連動 | `src/**/*.tsx`, `src/**/*.css`                     |
| `mobile-ux`         | ファイル連動 | Providers, shell, nav, locale, GDPR                |

## ルート別スコープ

```
/                 → project-core, w3c-accessibility, mobile-ux
/assessment       → + ai-provider (chat), w3c-accessibility, mobile-ux
/create           → project-core, w3c-accessibility, mobile-ux
/diagnosis        → + diagnosis-module, diagnosis-types, ai-streaming, ai-provider
/app/[id]         → project-core, w3c-accessibility
/quiz/[id]        → project-core, w3c-accessibility
```

## チャットでの手動指定

```
@diagnosis-module 質問カードのアニメーション調整
@ai-provider /api/chat を AI SDK に移行
@mobile-ux ナビの safe-area 再確認
@w3c-accessibility HTML 監査
```

## Phase 2 候補（スコープ提案済み）

| 優先 | タスク                     | 状態                  |
| ---- | -------------------------- | --------------------- |
| 高   | `/api/chat` → AI SDK       | ✅ 完了               |
| 高   | `AdaptiveChat` → `useChat` | ✅ 完了               |
| 中   | `scoreDiagnosis` テスト    | ✅ 完了（vitest 5件） |
| 中   | Assessment CSS → Tailwind  | ✅ 完了               |
| 低   | Next.js 15 昇格            | 未着手                |
