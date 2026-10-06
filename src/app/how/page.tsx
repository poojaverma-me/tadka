import AppShell from "@/components/AppShell";
import HowClient from "./HowClient";

export const metadata = { title: "How Jev picks · Tadka" };

export default async function HowPage({ searchParams }: PageProps<"/how">) {
  const q = (await searchParams).q;
  return (
    <AppShell>
      <HowClient initial={typeof q === "string" ? q : ""} />
    </AppShell>
  );
}
