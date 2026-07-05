import { Megaphone } from "lucide-react";

export default function AnnouncementBar({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 h-9 overflow-hidden bg-accent">
      <div className="flex h-full w-max animate-marquee items-center">
        <Segment text={text} />
        <Segment text={text} />
      </div>
    </div>
  );
}

function Segment({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-3 whitespace-nowrap px-4 text-xs sm:text-sm font-semibold text-[#171717]">
      <Megaphone size={14} className="shrink-0" />
      {text}
      <span className="mx-6 opacity-50">•</span>
    </span>
  );
}
