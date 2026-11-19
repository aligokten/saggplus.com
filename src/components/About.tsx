"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { about, company } from "@/lib/content";
import type { TeamMemberRecord } from "@/lib/team";
import SectionHeading from "./SectionHeading";
import Counter from "./motion/Counter";

const EASE = [0.22, 1, 0.36, 1] as const;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const avatarGradients = [
  "from-accent to-accent-2",
  "from-accent-2 to-accent-3",
  "from-accent-3 to-accent",
  "from-accent to-accent-2",
];

export type AboutStats = {
  yearsActive: number;
  projectCount: number;
  serviceCount: number;
};

export default function About({
  team,
  stats,
}: {
  team: TeamMemberRecord[];
  stats: AboutStats;
}) {
  const statItems = [
    { value: stats.yearsActive, suffix: "+", label: "Yıllık deneyim" },
    { value: stats.projectCount, suffix: "", label: "Proje" },
    { value: stats.serviceCount, suffix: "", label: "Hizmet alanı" },
  ].filter((item) => item.value > 0);

  return (
    <section id="hakkimizda" className="relative overflow-x-clip py-24 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Hakkımızda" title={`${company.name} kimdir?`} />

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-ink-muted whitespace-pre-line"
        >
          {about.intro}
        </motion.p>

        {statItems.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-y border-white/10">
            {statItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                className="px-2 py-8 sm:px-8"
              >
                <p className="text-5xl sm:text-6xl font-extrabold tracking-tight text-ink">
                  <Counter to={item.value} suffix={item.suffix} />
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -60, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="glass rounded-3xl p-8"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Target size={22} strokeWidth={1.75} />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Misyonumuz</h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-muted">
              {about.mission}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="glass rounded-3xl p-8"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-3/15 text-accent-3">
              <Eye size={22} strokeWidth={1.75} />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Vizyonumuz</h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-muted">
              {about.vision}
            </p>
          </motion.div>
        </div>

        {team.length > 0 && (
        <div className="mt-20">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-semibold"
          >
            Ekibimiz
          </motion.h3>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 160, damping: 16, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass rounded-3xl p-6 text-center"
              >
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="mx-auto h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} text-lg font-bold text-[#171717]`}
                  >
                    {initials(member.name)}
                  </div>
                )}
                <p className="mt-4 font-semibold text-ink">{member.name}</p>
                <p className="mt-1 text-xs text-ink-muted">{member.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
