import AppShell from "@/components/AppShell";
import SavedClient from "./SavedClient";

export const metadata = { title: "Saved · Tadka" };

export default function SavedPage() {
  return (
    <AppShell>
      <SavedClient />
    </AppShell>
  );
}
