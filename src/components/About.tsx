"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { about, company, team } from "@/lib/content";
import SectionHeading from "./SectionHeading";

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

export default function About() {
  return (
    <section id="hakkimizda" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Hakkımızda" title={`${company.name} kimdir?`} />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-ink-muted whitespace-pre-line"
        >
          {about.intro}
        </motion.p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-3xl p-8"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-2/15 text-accent-2">
              <Eye size={22} strokeWidth={1.75} />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Vizyonumuz</h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-muted">
              {about.vision}
            </p>
          </motion.div>
        </div>

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
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
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
                    className={`mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} text-lg font-bold text-[#05070d]`}
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
      </div>
    </section>
  );
}
