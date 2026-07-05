# SAGG+ Web Sitesi

SAGG+ (Sinem Ali Gökten Grup İnşaat Mimarlık Akustik Müh. San. Tic. Ltd. Şti.) için
Next.js ile geliştirilmiş kurumsal web sitesi. Proje yönetimi için bir admin paneli içerir.

## Özellikler

- **Anasayfa**: Hero, Hizmetlerimiz, Projeler, Hakkımızda, İletişim bölümleri, dinamik
  koyu gradient arkaplan.
- **Projeler**: Glassmorphism kart slider'ı; bir projeye tıklanınca arkaplanı
  buzlu (blur) bir modal içinde görsel slaytı, başlık ve proje bilgileri açılır.
- **İletişim formu**: Gönderilen mesajlar veritabanına kaydedilir ve `/admin/messages`
  sayfasında listelenir. **E-posta gönderimi şu an aktif değildir** (bkz. aşağıdaki
  "E-posta gönderimini aktifleştirme" bölümü).
- **Footer**: tadilatbodrum.com ve ruhsat360.com girişim linkleri, ofis konumunu
  gösteren düşük opasiteli harita arkaplanı.
- **Admin paneli** (`/admin`): Şifre korumalı, proje ekleme/düzenleme/silme/sıralama,
  görsel yükleme, gelen iletişim mesajlarını görüntüleme.

## Teknoloji

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion ·
better-sqlite3 · Leaflet (harita) · jose (admin oturumu)

## Kurulum

```bash
npm install
cp .env.example .env
```

`.env` dosyasını açıp aşağıdaki değerleri doldurun:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=guclu-bir-sifre-belirleyin
ADMIN_SESSION_SECRET=$(openssl rand -base64 48)   # rastgele üretin
```

Örnek projelerle başlamak isterseniz (isteğe bağlı, veritabanı boşsa çalışır):

```bash
node scripts/gen-placeholders.mjs   # örnek görselleri üretir
node scripts/seed.mjs               # örnek projeleri veritabanına ekler
```

## Geliştirme

```bash
npm run dev
```

## Production build & çalıştırma (VPS)

```bash
npm run build
npm start        # varsayılan olarak :3000 portunda çalışır
```

Sunucuda kalıcı çalıştırmak için `pm2` veya benzeri bir process manager, önünde de
Nginx/Caddy ile ters vekil (reverse proxy) + SSL kullanılması önerilir.

### Veri ve görsel depolama hakkında

Proje verileri `data/saggplus.db` (SQLite) dosyasında, admin panelden yüklenen
proje görselleri ise `public/uploads/` klasöründe tutulur. Bu klasörlerin
**sunucuda kalıcı bir diskte** olduğundan emin olun; sunucusuz (serverless,
örn. Vercel) barındırmada bu dosyalar her deploy'da sıfırlanır ve bu kurulum
biçimiyle uyumlu değildir.

## Admin Paneli

- Giriş: `/admin/login` — `.env` içindeki `ADMIN_USERNAME` / `ADMIN_PASSWORD` ile giriş yapılır.
- `/admin` — Projeleri listele, sırala (yukarı/aşağı oklar), düzenle, sil.
- `/admin/projects/new` — Yeni proje ekle: başlık, kategori, konum, yıl, kısa özet,
  detaylı açıklama ve görseller (JPG/PNG/WEBP/GIF, en fazla 10MB).
- `/admin/messages` — İletişim formundan gelen mesajları görüntüle.

## E-posta gönderimini aktifleştirme

Şu an iletişim formu gönderileri yalnızca veritabanına kaydediliyor ve
`/admin/messages` sayfasında görüntülenebiliyor; `info@saggplus.com` adresine
otomatik e-posta gönderimi henüz bağlanmadı. Aktifleştirmek için:

1. Bir SMTP hesabı edinin (Gmail uygulama şifresi, şirket e-posta sağlayıcınız,
   veya Resend/SendGrid gibi bir transactional email servisi).
2. `nodemailer` paketini kurun: `npm install nodemailer`.
3. `.env` dosyasına `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` değişkenlerini
   ekleyin.
4. `src/app/api/contact/route.ts` içinde, `createContactSubmission(...)` çağrısının
   hemen altına e-posta gönderme kodunu ekleyin.

## Proje Yapısı

```
src/
  app/
    (site)/          Genel site (anasayfa) — Header + arkaplan animasyonu içerir
    admin/           Admin paneli sayfaları
    api/             API route'ları (projeler, iletişim, admin auth)
  components/        Site bileşenleri (Hero, Projects, ProjectModal, Footer, ...)
  components/admin/  Admin paneli bileşenleri
  lib/               content.ts (statik metinler), db.ts, projects.ts, contact.ts, auth.ts
data/                SQLite veritabanı (git'e dahil değil)
public/uploads/      Proje görselleri
scripts/             Örnek veri/görsel üretme script'leri
```

## Düzenlenmesi Gereken İçerik

`src/lib/content.ts` dosyasında şirket bilgileri, hakkımızda metni, misyon/vizyon,
ekip üyeleri ve hizmetler bulunur. Özellikle:

- **Ekip**: `team` dizisindeki 3. ve 4. üyeler yer tutucudur (`Proje Mimarı`,
  `Akustik & Saha Uzmanı`) — gerçek isim, unvan ve fotoğraflarla güncelleyin.
- **Logo**: Şu an metin logosu (`SAGG+`) kullanılıyor; gerçek logo dosyanız varsa
  `Header.tsx` ve `Footer.tsx` içine `<img>`/`next/image` olarak eklenebilir.
- **Harita konumu**: `company.mapCoords` Milas merkez koordinatlarına yakın bir
  değerdir; ofisin tam konumunu Google Maps'ten alıp güncelleyebilirsiniz.
