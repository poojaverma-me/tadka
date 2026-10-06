"use client";

import { Bookmark, ChefHat, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSaved } from "@/lib/saved";

const TABS = [
  { href: "/", label: "Today", icon: ChefHat },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/how", label: "How Jev picks", icon: Sparkles },
] as const;

/** A floating peacock pill bar on phones; sticker tabs across the top on larger screens. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { ids } = useSaved();
  return (
    <div className="min-h-dvh">
      <header className="glass sticky top-0 z-30 hidden border-b-[1.5px] border-edge sm:block">
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-6">
          <Link href="/" className="mr-6 flex items-center gap-2.5">
            <Logo />
            <span className="display text-[30px] lowercase">tadka</span>
            <span className="hand -rotate-6 text-[15px] text-rani">what to cook?</span>
          </Link>
          {TABS.map((t) => {
            const on = path === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1.5 text-[14px] font-bold transition ${on ? "border-edge bg-rani text-white shadow-[3px_3px_0_var(--edge)]" : "border-transparent text-ink-2 hover:border-edge"}`}
              >
                <t.icon size={15} strokeWidth={2.4} /> {t.label}
                {t.href === "/saved" && ids.length > 0 && <span className={`ml-0.5 rounded-full px-1.5 text-[11px] tabular-nums ${on ? "bg-white text-rani" : "bg-pista text-ink"}`}>{ids.length}</span>}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-5 sm:px-6 sm:pb-16 sm:pt-10">{children}</main>

      <nav className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 sm:hidden" aria-label="Tabs">
        <div className="pointer-events-auto mx-auto flex max-w-sm items-center justify-between gap-1 rounded-full border-[1.5px] border-edge bg-peacock p-1.5 shadow-[4px_4px_0_var(--edge)]">
          {TABS.map((t) => {
            const on = path === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-bold transition ${on ? "bg-pista text-[#0d2b30]" : "text-white/75"}`}
              >
                <t.icon size={19} strokeWidth={2.4} />
                {on && <span>{t.label === "How Jev picks" ? "How" : t.label}</span>}
                {t.href === "/saved" && ids.length > 0 && <span className="absolute -top-1 right-3 grid h-[18px] min-w-[18px] place-items-center rounded-full border-[1.5px] border-edge bg-rani px-1 text-[10px] text-white">{ids.length}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/icon-192.png" alt="" width={size} height={size} className="rounded-[10px] border-[1.5px] border-edge" />
  );
}
