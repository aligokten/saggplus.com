import AdminShell from "@/components/admin/AdminShell";
import AkustikUsersList from "@/components/admin/AkustikUsersList";
import { DEMO_SURESI_SAAT, listAkustikUsers } from "@/lib/akustik";

export const dynamic = "force-dynamic";

export default function AkustikUsersPage() {
  const users = listAkustikUsers();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold">Akustik Kullanıcıları</h1>
      <p className="mt-1 text-sm text-ink-muted">
        akustik.saggplus.com giriş hesapları. Demo hesabı ilk girişten itibaren{" "}
        {DEMO_SURESI_SAAT} saat geçerlidir; süre dolunca şifre silinir ve hesap kapanır.
      </p>

      <div className="mt-6">
        <AkustikUsersList users={users} demoHours={DEMO_SURESI_SAAT} />
      </div>
    </AdminShell>
  );
}
