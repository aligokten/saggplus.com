import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();
  const announcementEnabled = Boolean(settings.announcement_enabled) && Boolean(settings.announcement_text);

  return (
    <div className="flex flex-col flex-1" id="top">
      <AnimatedBackground />
      {announcementEnabled && <AnnouncementBar text={settings.announcement_text} />}
      <Header announcementEnabled={announcementEnabled} />
      {children}
    </div>
  );
}
