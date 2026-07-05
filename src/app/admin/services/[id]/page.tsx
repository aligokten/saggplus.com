import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ServiceForm from "@/components/admin/ServiceForm";
import { getService } from "@/lib/services";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = getService(id);
  if (!service) notFound();

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Hizmeti Düzenle</h1>
      <ServiceForm service={service} />
    </AdminShell>
  );
}
