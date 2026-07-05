import AdminShell from "@/components/admin/AdminShell";
import ServicesList from "@/components/admin/ServicesList";
import { listServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export default function AdminServicesPage() {
  const services = listServices();
  return (
    <AdminShell>
      <ServicesList services={services} />
    </AdminShell>
  );
}
