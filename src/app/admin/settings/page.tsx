import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const settings = getSettings();
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
