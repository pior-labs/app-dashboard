import type { LucideIcon } from "lucide-react";
import {
  Bot,
  ChartNoAxesCombined,
  Container,
  Film,
  Gauge,
  HardDrive,
  HeartPulse,
  KeyRound,
  Network,
  Send,
} from "lucide-react";

export type LinkStatus = "online" | "idle" | "offline";

export type LinkIconName =
  | "Bot"
  | "ChartNoAxesCombined"
  | "Container"
  | "Film"
  | "Gauge"
  | "HardDrive"
  | "HeartPulse"
  | "KeyRound"
  | "Network"
  | "Send";

export type LinkItem = {
  name: string;
  description?: string;
  href: string;
  previewImage?: string;
  icon?: LucideIcon;
  group: string;
  badge?: string;
  status?: LinkStatus;
  newTab?: boolean;
};

export type EnvLinkItem = Omit<LinkItem, "icon"> & {
  icon?: LinkIconName;
};

export type Section = {
  title: string;
  links: LinkItem[];
};

const ICONS: Record<LinkIconName, LucideIcon> = {
  Bot,
  ChartNoAxesCombined,
  Container,
  Film,
  Gauge,
  HardDrive,
  HeartPulse,
  KeyRound,
  Network,
  Send,
};

function parseLinks(rawLinks: string | undefined): EnvLinkItem[] {
  if (!rawLinks) return [];

  try {
    const parsed = JSON.parse(rawLinks);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("VITE_DASHBOARD_LINKS must be a JSON array.", error);
    return [];
  }
}

export const links: LinkItem[] = parseLinks(import.meta.env.VITE_DASHBOARD_LINKS).map((link) => ({
  ...link,
  icon: link.icon ? ICONS[link.icon] : undefined,
}));

/** Distinct group titles, in first-seen order. */
export const groups: string[] = links.reduce<string[]>((acc, link) => {
  if (!acc.includes(link.group)) acc.push(link.group);
  return acc;
}, []);

/** Links bucketed into sections for grid-style layouts. */
export const sections: Section[] = groups.map((title) => ({
  title,
  links: links.filter((link) => link.group === title),
}));
