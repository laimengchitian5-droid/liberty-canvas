/**
 * Rubel Canvas design system — Slate + Indigo + glassmorphism.
 */
export const rubelDs = {
  page: "min-h-[100dvh] bg-gradient-to-b from-slate-950 via-slate-955 to-indigo-950/30 text-slate-200",
  header:
    "text-center text-xl font-bold tracking-tight text-slate-100 drop-shadow-sm",
  subheader: "text-sm leading-relaxed text-slate-400",
  glassHeader:
    "border-b border-white/10 bg-slate-950/60 backdrop-blur-xl backdrop-saturate-150",
  glassCard:
    "rounded-2xl border border-white/10 bg-slate-900/45 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150",
  glassCardPadding:
    "rounded-2xl border border-white/10 bg-slate-900/45 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150",
  glassReveal:
    "rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-slate-900/80 via-indigo-950/50 to-slate-900/70 p-8 text-center shadow-[0_0_60px_rgba(99,102,241,0.18)] backdrop-blur-2xl",
  card: "rounded-xl border border-slate-800 bg-slate-900",
  cardPadding: "rounded-xl border border-slate-800 bg-slate-900 p-5",
  body: "text-sm text-slate-200 leading-relaxed",
  label: "text-sm font-medium text-slate-200",
  muted: "text-sm text-slate-500",
  option:
    "w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-4 text-left text-sm text-slate-100 shadow-sm backdrop-blur-md transition-all hover:border-indigo-400/30 hover:bg-slate-800/60 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-50",
  primary:
    "rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50",
  input:
    "min-h-11 w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none backdrop-blur-md focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500",
  bubbleAi:
    "max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-slate-900/55 px-4 py-3 text-sm leading-relaxed text-slate-100 backdrop-blur-md",
  bubbleUser:
    "max-w-[85%] ml-auto rounded-2xl rounded-br-md bg-gradient-to-br from-indigo-500 to-indigo-600 px-4 py-3 text-sm leading-relaxed text-white shadow-lg shadow-indigo-500/25",
  archetypeTitle: "text-2xl font-bold tracking-tight text-white sm:text-3xl",
  archetypeSubtitle: "text-sm text-indigo-200/80",
  /** Screen-Shot Trap — premium share card for X/LINE */
  screenshotTrap:
    "relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/90 via-indigo-950/60 to-violet-950/70 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_80px_rgba(99,102,241,0.22)] backdrop-blur-md sm:p-8",
  screenshotTrapGlow:
    "pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-400/30 via-transparent to-violet-500/20 opacity-80",
  screenshotTrapBrand:
    "mt-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-indigo-300/70",
  screenshotTrapQuote:
    "mt-3 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs italic text-slate-300 backdrop-blur-md",
} as const;
