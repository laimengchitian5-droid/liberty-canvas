/** Shared Tailwind design tokens — core engine + satellite pages. */
export { rubelDs } from "@/lib/rubel/rubelDesignSystem";

export const rubelTheme = {
  page: "min-h-[100dvh] bg-gradient-to-b from-slate-950 via-slate-955 to-indigo-950/40 text-slate-100",
  container: "mx-auto w-full max-w-md px-4",
  fontLatin: "font-sans",
  fontCjk: "font-sans-jp",
} as const;
