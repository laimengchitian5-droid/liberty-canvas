# ファイル設計図（Conductor / Nav / pSEO）

正本ツリー。スケッチの誤り（`lib/navigation/`、Edge Conductor、「197カ国」、48px、`GlobalNavbar`）は採用しない。

## 禁止フォーク

- `GlobalNavbar.tsx` / `GlobalNavbar.module.css`
- Discover ページ内ヘッダ二重注入
- `IdentityHubConductor.module.css` への `gateGrid` 混入
- `--canvas-*` トークン並列系統
- Conductor `runtime = "edge"`

## レイヤ付きツリー（実パス）

```text
src/
├── app/
│   ├── globals.css                          # L0: --lc-* Adult-Cute トークン
│   ├── api/station/conductor/route.ts       # L3: Node.js AI 改札 API（Edge 禁止）
│   └── discover/[locale]/[slug]/page.tsx   # L4: Discover pSEO SSG + JSON-LD
├── types/
│   ├── conductor.ts                         # Zod: Conductor 入出力
│   ├── telemetry.ts                         # Zod: Conductor 計測
│   └── pseoManifest.ts                      # Zod: Discover マニフェスト
├── lib/
│   ├── station/
│   │   ├── conductorEngine.ts               # L3: キーワード/帯 → Plug slug facade
│   │   ├── telemetryEngine.ts               # L3: 同意付き非同期計測
│   │   ├── pseoManifestEngine.ts            # L4: landingCatalog → Pseo 投影
│   │   └── identityConductor/               # L3: 改札パイプライン本体
│   │       ├── runIdentityConductor.ts
│   │       ├── routeExpressLine.ts
│   │       ├── conductorFallback.ts
│   │       ├── conductorCopy.ts
│   │       ├── expressLines.ts
│   │       └── …
│   └── landing/
│       ├── landingCatalog.ts                # L4: locale×topic カタログ正本
│       ├── landingTopics.ts
│       ├── landingCopy.ts
│       └── landingLocales.ts
├── components/
│   ├── AppShell.tsx                         # L1: GlobalNav / immersive 出し分け
│   ├── navigation/
│   │   ├── GlobalNav.tsx                    # L1: ナビ + 認証カプセル
│   │   ├── GlobalNav.module.css
│   │   └── buildGlobalNavItems.ts           # L1: 生きたルート登録（※ lib/ ではない）
│   ├── auth/
│   │   └── UserAuthPanel.tsx                # L1: rail | popover 認証
│   ├── i18n/
│   │   └── LocaleSwitcher.tsx               # L1: 言語切替（タッチ ≥ 44px）
│   ├── landing/
│   │   └── LandingIntakeClient.tsx          # L4: Discover LP UI
│   └── station/
│       ├── CentralTerminalHub.tsx           # L2: シェル + 15路線 grid
│       ├── CentralTerminalHub.module.css    # .terminalContainer / .terminalGrid
│       ├── IdentityHubConductor.tsx         # L2: 改札 UI
│       └── IdentityHubConductor.module.css  # .panel / .resultSlot（gate なし）
└── scripts/
    └── deploy-prod-gate.mjs                 # ci:release → 任意 --prod
```

## 依存方向

```text
app/          → components/ · lib/ · types/
components/   → lib/ · types/ · app/globals tokens
lib/          → types/ · 他 lib（循環禁止）
types/        → zod · 必要なら landing/i18n 定数のみ
```

## レイヤ意味

| Layer | 責務 |
|---|---|
| L0 | デザイントークン（`--lc-*`） |
| L1 | アプリシェル / ナビ / 認証 / 言語 |
| L2 | Station ハブ + Conductor UI |
| L3 | Conductor API · エンジン · 計測（Node） |
| L4 | Discover カタログ · SSG LP · マニフェスト投影 |

## ランタイム / 規模（事実）

| 項目 | 正 |
|---|---|
| Conductor API | `runtime = "nodejs"`（AI SDK 秘密鍵） |
| Discover SSG | `LANDING_LOCALES × topics`（約 126 セル。197 カ国マップではない） |
| タッチターゲット | `--lc-touch-min: 44px` |
| 送客 | ファーストパーティ `plugPlayPath` / `ctaHref` のみ |
| Plug slug | `personality-spectrum` · `big-five` · `motivation-spectrum` · `oshikatsu` · `romance` · `genz` |

## データフロー（Conductor）

```text
IdentityHubConductor
  → POST /api/station/conductor
  → identityConductor (route + AI prose | fallback)
  → ConductorResponseSchema
  → telemetryEngine (pre_screen / express_boarded)
  → Link ctaHref → /diagnosis/play/{slug}
```

## データフロー（Discover）

```text
generateAllPseoRoutes() = listLandingStaticParams()
  → resolveLandingPage / buildLandingMetadata
  → LandingIntakeClient
  → first-party plugPlayPath
```

## デプロイ

- `npm run deploy:gate` → `ci:release` のみ
- `npm run deploy:prod:gated` → `ci:release` + `deploy:prod`
- 脚本は git commit/push / vercel env 上書きをしない（詳細: [DEPLOY.md](./DEPLOY.md)）
