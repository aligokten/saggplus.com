// Decorative contour-map backdrop. Generated once with scripts/gen-izohips.mjs
// (marching squares over fractal noise) and served as a static asset, so the
// footer needs no map tiles, no external requests and no API key.
export default function FooterMap() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
      style={{ backgroundImage: "url('/izohips.svg')" }}
    />
  );
}
