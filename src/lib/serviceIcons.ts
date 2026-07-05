import {
  Compass,
  Sofa,
  Waves,
  HardHat,
  Hammer,
  MonitorSmartphone,
  Building2,
  Wrench,
  Ruler,
  PaintBucket,
  ShieldCheck,
  ClipboardList,
  Home,
  Layers,
  Lightbulb,
  DraftingCompass,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  sofa: Sofa,
  waves: Waves,
  "hard-hat": HardHat,
  hammer: Hammer,
  "monitor-smartphone": MonitorSmartphone,
  building: Building2,
  wrench: Wrench,
  ruler: Ruler,
  "paint-bucket": PaintBucket,
  "shield-check": ShieldCheck,
  "clipboard-list": ClipboardList,
  home: Home,
  layers: Layers,
  lightbulb: Lightbulb,
  drafting: DraftingCompass,
};

export const SERVICE_ICON_KEYS = Object.keys(SERVICE_ICONS);

export const DEFAULT_SERVICE_ICON = "compass";
