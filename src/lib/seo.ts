import { company } from "./content";

/** Tek kanonik alan adı. www'suz adres Nginx'te buna 301 ile yönlendirilmeli. */
export const SITE_URL = "https://www.saggplus.com";

export const SITE_TITLE = `${company.name} | Mimarlık, İç Mekan, Akustik & İnşaat – Milas, Bodrum`;

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["ArchitecturalService", "GeneralContractor"],
    "@id": `${SITE_URL}/#organization`,
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    description: company.shortDescription,
    foundingDate: company.founded,
    email: company.email,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "İsmetpaşa Mahallesi, Zafer Caddesi No:42/C-D",
      addressLocality: "Milas",
      addressRegion: "Muğla",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.mapCoords.lat,
      longitude: company.mapCoords.lng,
    },
    areaServed: ["Milas", "Bodrum", "Muğla"],
    knowsAbout: [
      "Mimari proje",
      "İç mekan tasarımı",
      "Akustik rapor",
      "Akustik proje",
      "Anahtar teslim inşaat",
      "Tadilat",
    ],
    sameAs: [company.instagram, "https://www.facebook.com/sagginsaatmimarlik/"],
  };
}
