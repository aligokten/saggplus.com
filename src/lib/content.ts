// Static site content. Edit here for copy changes that aren't project data.

export const company = {
  name: "SAGG+",
  legalName:
    "Sinem Ali Gökten Grup İnşaat Mimarlık Akustik Müh. San. Tic. Ltd. Şti.",
  tagline: "Hayallerin gerçeğe dönüştüğü yere hoşgeldiniz.",
  shortDescription:
    "Mimarlık, iç mekan tasarımı, akustik mühendislik ve anahtar teslim inşaat hizmetlerini tek çatı altında sunan Ege Bölgesi merkezli tasarım & yapı ofisi.",
  founded: "2020",
  city: "Milas, Muğla",
  address: "İsmetpaşa Mahallesi, Zafer Caddesi No:42/C-D, Milas / Muğla",
  email: "info@saggplus.com",
  instagram: "https://www.instagram.com/sagg.insaat/",
  // Approximate coordinates for Milas, Muğla city center — update with the exact
  // office coordinates if you have them (e.g. from Google Maps "share location").
  mapCoords: { lat: 37.3164, lng: 27.7839 },
};

export const about = {
  intro: `SAGG+, 2020 yılından bu yana Mimar Ali Gökten ve Mimar H. Sinem Helvacıoğlu Gökten
ortaklığında Milas merkezli olarak Milas ve Bodrum bölgesinde hizmet veren bir mimarlık,
akustik mühendislik ve inşaat ofisidir. Bir yapının ilk eskizinden sahadaki son
uygulamasına kadar tüm süreci kendi bünyemizdeki mimar kadromuz ile planlıyor,
güvenilir iş ortaklarımız ve uzman taşeron ekiplerimizle birlikte eksiksiz şekilde
hayata geçiriyoruz.`,
  mission: `Müşterilerimizin ihtiyaç ve taleplerine uygun, işlevsel ve estetik değeri yüksek
mekanlar üretmek; tasarımdan uygulamaya kadar tüm süreçte şeffaflık, kalite ve
güvenilirliği bir arada sunmak.`,
  vision: `Mimari proje, akustik, mühendislik, inşaat, taahhüt ve tadilat hizmetlerinde
Ege Bölgesi'nde öncü bir konuma ulaşmak; uzman kadromuz ve sürekli yenilikçi
yaklaşımımızla sektörde referans gösterilen bir marka olmak.`,
};

export type Venture = {
  name: string;
  url: string;
  description: string;
};

export const ventures: Venture[] = [
  {
    name: "tadilatbodrum.com",
    url: "https://tadilatbodrum.com",
    description: "Bodrum bölgesine özel tadilat ve yenileme hizmetleri",
  },
  {
    name: "ruhsat360.com",
    url: "https://ruhsat360.com",
    description: "Yapı ruhsatı ve izin süreçleri danışmanlığı",
  },
];

export const nav = [
  { href: "#projeler", label: "Projeler" },
  { href: "#hizmetlerimiz", label: "Hizmetlerimiz" },
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "#iletisim", label: "İletişim" },
];
