"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import DishSheet from "@/components/DishSheet";
import ResultList from "@/components/ResultList";
import { DISH_BY_ID } from "@/lib/dishes";
import type { Ranked } from "@/lib/rank";
import { useSaved } from "@/lib/saved";

export default function SavedClient() {
  const { ids } = useSaved();
  const [open, setOpen] = useState<Ranked | null>(null);
  const items = useMemo(() => ids.filter((id) => DISH_BY_ID[id]).map((id, index) => ({ dish: DISH_BY_ID[id], index, score: 1, fit: 1, factors: [] })), [ids]);
  return (
    <div>
      <div className="hand inline-block -rotate-3 text-[22px] leading-none text-rani">Your cookbook</div>
      <h1 className="display mt-2 text-[56px] uppercase">
        Saved <span className="text-rani">dishes</span>
      </h1>
      <p className="mt-2 text-[15px] text-ink-2">Kept on this device, and available offline once you&apos;ve opened them.</p>
      <div className="mt-6">
        {items.length === 0 ? (
          <div className="card flex flex-col items-center rounded-3xl px-6 py-12 text-center">
            <span className="grid h-16 w-16 -rotate-6 place-items-center rounded-[16px] border-[2px] border-edge bg-pista text-[#0d2b30] shadow-[3px_3px_0_var(--edge)]">
              <Bookmark size={24} />
            </span>
            <h2 className="display mt-5 text-[30px] uppercase">Nothing saved yet</h2>
            <p className="mt-1 max-w-xs text-[14.5px] text-ink-2">Open a dish and tap Save to keep it here for the next time you can&apos;t decide.</p>
            <Link href="/" className="mt-5 rounded-full border-[1.5px] border-edge bg-rani px-5 py-2.5 text-[15px] font-extrabold text-white shadow-[3px_3px_0_var(--edge)]">
              Find something to cook
            </Link>
          </div>
        ) : (
          <ResultList items={items} wave="saved" onOpen={setOpen} showScore={false} />
        )}
      </div>
      <DishSheet item={open} onClose={() => setOpen(null)} />
    </div>
  );
}
