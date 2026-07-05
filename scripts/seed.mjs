// Seeds sample projects/services/team so the redesigned site has content out
// of the box. Safe to re-run: each section is skipped independently if it
// already has rows. Edit or remove these via the admin panel once real
// content is added.
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { nanoid } from "nanoid";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "saggplus.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    year TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    is_read INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    icon TEXT NOT NULL DEFAULT 'compass',
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    photo TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    hero_image TEXT NOT NULL DEFAULT '/hero.jpg',
    announcement_enabled INTEGER NOT NULL DEFAULT 0,
    announcement_text TEXT NOT NULL DEFAULT ''
  );
  INSERT OR IGNORE INTO site_settings (id, hero_image, announcement_enabled, announcement_text)
  VALUES (1, '/hero.jpg', 0, '');
`);

seedProjects();
seedServices();
seedTeam();

function seedProjects() {
  const count = db.prepare("SELECT COUNT(*) as c FROM projects").get().c;
  if (count > 0) {
    console.log(`Skipping projects: ${count} already exist.`);
    return;
  }

  const images = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scripts", "seed-images.json"), "utf-8")
  );
  const imagesBySlug = Object.fromEntries(images.map((i) => [i.slug, i.images]));

  const projects = [
    {
      title: "Bodrum Villa Projesi",
      slug: "bodrum-villa",
      category: "Mimari Proje",
      location: "Bodrum, Muğla",
      year: "2024",
      summary: "Deniz manzaralı özel villa için konsept mimari proje ve uygulama.",
      description:
        "Bodrum yarımadasında, topografyaya uyumlu kademeli kütle kurgusu ile tasarlanan özel villa projesi. Yerel taş dokusu ve geniş cam yüzeylerle iç-dış mekan bütünlüğü hedeflendi.",
    },
    {
      title: "Milas Ofis Binası Tadilatı",
      slug: "milas-ofis-tadilat",
      category: "Tadilat",
      location: "Milas, Muğla",
      year: "2023",
      summary: "Mevcut ofis binasının çağdaş çalışma alanlarına dönüştürülmesi.",
      description:
        "Eski bir ticari binanın enerji verimliliği, aydınlatma ve açık ofis kurgusu gözetilerek yeniden tasarlandığı kapsamlı tadilat projesi.",
    },
    {
      title: "Akustik Konser Salonu Raporu",
      slug: "akustik-konser-salonu",
      category: "Akustik Rapor",
      location: "Milas, Muğla",
      year: "2023",
      summary: "Çok amaçlı salon için akustik ölçüm, modelleme ve iyileştirme raporu.",
      description:
        "Salon içi yankılanma süresi ve gürültü izolasyonu ölçümleri yapılarak, akustik konfor standartlarına uygun malzeme ve uygulama önerileri sunuldu.",
    },
    {
      title: "Zafer Caddesi Rezidans",
      slug: "zafer-caddesi-rezidans",
      category: "Anahtar Teslim İnşaat",
      location: "Milas, Muğla",
      year: "2022",
      summary: "Temelden teslimata kadar yönetilen çok katlı rezidans projesi.",
      description:
        "Proje ve ruhsat sürecinden başlayıp anahtar teslimine kadar uzanan, saha yönetimi tarafımızca yürütülen çok katlı konut projesi.",
    },
    {
      title: "Sahil Konutu İç Mekan Tasarımı",
      slug: "sahil-konutu-ic-mekan",
      category: "İç Mekan Tasarımı",
      location: "Bodrum, Muğla",
      year: "2024",
      summary: "Sahil evi için doğal malzeme ağırlıklı iç mekan konsepti.",
      description:
        "Yerel dokuları modern çizgilerle buluşturan, doğal ışığı önceleyen iç mekan tasarımı ve mobilya seçkisi.",
    },
    {
      title: "Kurumsal UI/UX Vitrin Projesi",
      slug: "kurumsal-uiux-vitrin",
      category: "UI/UX Design",
      location: "Dijital",
      year: "2025",
      summary: "Kurumsal müşteri için dijital ürün arayüzü tasarımı.",
      description:
        "Kullanıcı araştırması, akış tasarımı ve yüksek çözünürlüklü arayüz tasarımlarını kapsayan uçtan uca UI/UX süreci.",
    },
  ];

  const insert = db.prepare(
    `INSERT INTO projects
      (id, title, slug, category, location, year, summary, description, images, sort_order, published)
     VALUES (@id, @title, @slug, @category, @location, @year, @summary, @description, @images, @sort_order, 1)`
  );

  projects.forEach((p, i) => {
    insert.run({
      id: nanoid(),
      ...p,
      images: JSON.stringify(imagesBySlug[p.slug] ?? []),
      sort_order: i,
    });
  });

  console.log(`Seeded ${projects.length} projects.`);
}

function seedServices() {
  const count = db.prepare("SELECT COUNT(*) as c FROM services").get().c;
  if (count > 0) {
    console.log(`Skipping services: ${count} already exist.`);
    return;
  }

  const services = [
    {
      icon: "compass",
      title: "Mimari Proje",
      description:
        "Konsept tasarımdan ruhsat sürecine, uygulama projelerine kadar uçtan uca mimari proje hizmeti.",
    },
    {
      icon: "sofa",
      title: "İç Mekan Tasarımı",
      description:
        "Konut, ofis ve ticari alanlar için işlevsel ve estetik iç mekan tasarımı & uygulama.",
    },
    {
      icon: "waves",
      title: "Akustik Rapor",
      description:
        "Yönetmeliklere uygun akustik ölçüm, raporlama ve akustik konfor danışmanlığı.",
    },
    {
      icon: "hard-hat",
      title: "Anahtar Teslim İnşaat",
      description: "Projelendirmeden teslimata kadar tüm inşaat sürecinin tek elden yönetimi.",
    },
    {
      icon: "hammer",
      title: "Tadilat",
      description:
        "Konut ve iş yerlerinde kapsamlı yenileme, güçlendirme ve tadilat uygulamaları.",
    },
    {
      icon: "monitor-smartphone",
      title: "UI/UX Design",
      description:
        "Dijital ürünler için kullanıcı deneyimi odaklı arayüz tasarımı ve prototipleme.",
    },
  ];

  const insert = db.prepare(
    `INSERT INTO services (id, icon, title, description, sort_order, published)
     VALUES (@id, @icon, @title, @description, @sort_order, 1)`
  );

  services.forEach((s, i) => insert.run({ id: nanoid(), ...s, sort_order: i }));

  console.log(`Seeded ${services.length} services.`);
}

function seedTeam() {
  const count = db.prepare("SELECT COUNT(*) as c FROM team_members").get().c;
  if (count > 0) {
    console.log(`Skipping team: ${count} already exist.`);
    return;
  }

  const team = [
    { name: "Ali Gökten", title: "Kurucu Ortak / Mimar" },
    { name: "H. Sinem Helvacıoğlu Gökten", title: "Kurucu Ortak / Mimar" },
    { name: "Oktay Turgut", title: "Mimar" },
    { name: "Eda Yavaş", title: "Mimar" },
  ];

  const insert = db.prepare(
    `INSERT INTO team_members (id, name, title, photo, sort_order, published)
     VALUES (@id, @name, @title, '', @sort_order, 1)`
  );

  team.forEach((t, i) => insert.run({ id: nanoid(), ...t, sort_order: i }));

  console.log(`Seeded ${team.length} team members.`);
}
