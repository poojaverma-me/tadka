import AppShell from "@/components/AppShell";
import { DISHES } from "@/lib/dishes";
import { IMAGES } from "@/lib/images";

export const metadata = { title: "Photo credits · Tadka" };

export default function Credits() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="display text-[52px] uppercase">Photo credits</h1>
        <p className="mt-2 text-[15px] text-ink-2">
          Every dish photo comes from Wikimedia Commons and is used under the licence shown, with thanks to the photographers. Tap a name for the
          original file.
        </p>
        <ul className="mt-6 divide-y divide-line text-[14px]">
          {DISHES.map((d) => {
            const img = IMAGES[d.id];
            return (
              <li key={d.id} className="flex items-center gap-3 py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.small} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{d.name}</div>
                  <div className="truncate text-ink-3">
                    <a href={img.page} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                      {img.credit}
                    </a>{" "}
                    · {img.licenseUrl ? <a href={img.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{img.license}</a> : img.license}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
