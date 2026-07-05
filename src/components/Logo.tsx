// eslint-disable-next-line @next/next/no-img-element
export default function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return <img src="/logo.png" alt="SAGG+" className={className} />;
}
