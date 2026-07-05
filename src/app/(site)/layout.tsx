import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1" id="top">
      <AnimatedBackground />
      <Header />
      {children}
    </div>
  );
}
