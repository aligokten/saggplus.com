import AdminShell from "@/components/admin/AdminShell";
import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Yeni Hizmet</h1>
      <ServiceForm />
    </AdminShell>
  );
}
