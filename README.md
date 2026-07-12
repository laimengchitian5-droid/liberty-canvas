# LibertyCanvas

**60秒で、あなたの「心の色」が AI に届く。**  
Universal AI Canvas — 診断データを構造化して適応型 AI に渡す、本番稼働の Web プラットフォーム。

| | |
|---|---|
| **本番** | https://liberty-canvas.vercel.app |
| **旗艦体験** | [/diagnosis](https://liberty-canvas.vercel.app/diagnosis) — 心の色診断 |
| **深掘り版** | [/assessment](https://liberty-canvas.vercel.app/assessment) — MBTI + Kraepelin + 適応 AI |

---

## 何が違うか

```
診断（6問） → 4軸スコア → 結果カタログ → AI 構造化 JSON ストリーム
                    ↓
              SNS OG / シェア URL / GSC インデックス
```

- **ChatGPT 単体との差:** 診断スコア・persona が API に構造化注入される  
- **占いアプリとの差:** 決定論的採点 + Zod 検証 + フォールバック  
- **クイズサイトとの差:** 適応 AI チャット + Forge UGC + WCAG 2.2

---

## スタック

Next.js 14 · React 18 · TypeScript strict · Vercel AI SDK · Tailwind + CSS Modules · Framer Motion · Vitest

AI プロバイダ優先: `OpenAI → Anthropic → Groq`（`src/lib/ai/provider.ts`）

---

## ルート

| Path | 用途 |
|------|------|
| `/` | Explore Hub |
| `/diagnosis` | 心の色診断（6問 + AI advice） |
| `/diagnosis/result/[category]` | SEO / OG / シェア用ランディング |
| `/assessment` | MBTI + Kraepelin + Adaptive Chat |
| `/create` | Forge Canvas（UGC） |
| `/app/[id]` · `/quiz/[id]` | 公開アプリ |

---

## 開発

```bash
npm install
npm run dev
npm run test      # scoreDiagnosis + share
npm run build
```

### 環境変数

| Variable | 用途 |
|----------|------|
| `GROQ_API_KEY` | AI（最低1つ） |
| `OPENAI_API_KEY` | 優先プロバイダ（任意） |
| `ANTHROPIC_API_KEY` | 同上 |
| `NEXT_PUBLIC_SITE_URL` | OG / canonical |
| `BLOB_READ_WRITE_TOKEN` | 本番クイズ永続化 |

---

## ドキュメント

- [90秒デモ台本](docs/DEMO-SCRIPT-90s.md)
- [Why AI SDK](docs/WHY-AI-SDK.md)
- [文化祭 QR](docs/MATSURI-QR.md)

---

## 品質

- W3C Nu HTML: 主要ルート 0 errors  
- モバイル: safe-area · 44px touch · `100dvh`  
- Cursor Rules: `.cursor/rules/`（スコープ提案付き）

---

## 作者コンテキスト

LibertyCanvas — 特待・IT 学科 · 在校生代表 · 文化祭 · ボランティア  
Portfolio proof: **設計 → 型 → テスト → 本番 → SEO → 計測** の一気通貫。
