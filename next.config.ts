import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Eski Wix sitesinden kalan ve Google'da indeksli URL'ler. Hizmet/blog
  // sayfaları ayrı URL olarak eklendiğinde hedefleri güncelleyin.
  async redirects() {
    return [
      { source: "/hakkimizda", destination: "/#hakkimizda", permanent: true },
      { source: "/insaat", destination: "/#hizmetlerimiz", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog-1/:path*", destination: "/", permanent: true },
      { source: "/post/:path*", destination: "/", permanent: true },
      { source: "/bgkky", destination: "/#hizmetlerimiz", permanent: true },
      { source: "/magaza", destination: "/", permanent: true },
      { source: "/sinemgokten", destination: "/#hakkimizda", permanent: true },
      { source: "/iletisim", destination: "/#iletisim", permanent: true },
    ];
  },
};

export default nextConfig;
