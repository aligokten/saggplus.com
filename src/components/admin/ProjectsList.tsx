"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, EyeOff } from "lucide-react";
import type { Project } from "@/lib/projects";

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [items, setItems] = useState(projects);
  const [busy, setBusy] = useState(false);

  async function persistOrder(next: Project[]) {
    setItems(next);
    setBusy(true);
    await fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((p) => p.id) }),
    });
    setBusy(false);
    router.refresh();
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  async function handleDelete(project: Project) {
    if (!confirm(`"${project.title}" projesini silmek istediğinize emin misiniz?`)) return;
    setBusy(true);
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((p) => p.id !== project.id));
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projeler</h1>
          <p className="mt-1 text-sm text-ink-muted">{items.length} proje</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-[#05070d] hover:bg-accent transition-colors"
        >
          <Plus size={16} /> Yeni Proje
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-sm text-ink-muted">Henüz proje eklenmedi.</p>
        )}
        {items.map((project, i) => (
          <div
            key={project.id}
            className="flex items-center gap-4 rounded-2xl glass p-4"
          >
            <div className="h-16 w-24 shrink-0 rounded-xl overflow-hidden bg-white/5">
              {project.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.images[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{project.title}</p>
                {!project.published && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-ink-muted">
                    <EyeOff size={10} /> taslak
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                {project.category} · {project.location} · {project.year}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={busy || i === 0}
                aria-label="Yukarı taşı"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ArrowUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={busy || i === items.length - 1}
                aria-label="Aşağı taşı"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ArrowDown size={15} />
              </button>
              <Link
                href={`/admin/projects/${project.id}`}
                aria-label="Düzenle"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 transition-colors"
              >
                <Pencil size={15} />
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(project)}
                disabled={busy}
                aria-label="Sil"
                className="grid h-9 w-9 place-items-center rounded-full text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
