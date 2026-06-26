import { useEffect, useState } from "react";
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

export type JsonLinkItem = Omit<LinkItem, "icon"> & {
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

function toLinkItem(link: JsonLinkItem): LinkItem {
  return {
    ...link,
    icon: link.icon ? ICONS[link.icon] : undefined,
  };
}

async function fetchDashboardLinks(): Promise<LinkItem[]> {
  try {
    const response = await fetch("/links.json");
    if (!response.ok) return [];

    const parsed = await response.json();
    return Array.isArray(parsed) ? parsed.map(toLinkItem) : [];
  } catch (error) {
    console.warn("Could not load /links.json.", error);
    return [];
  }
}

export function useDashboardLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    let active = true;

    fetchDashboardLinks().then((nextLinks) => {
      if (active) setLinks(nextLinks);
    });

    return () => {
      active = false;
    };
  }, []);

  return links;
}

export function getGroups(links: LinkItem[]): string[] {
  return links.reduce<string[]>((acc, link) => {
    if (!acc.includes(link.group)) acc.push(link.group);
    return acc;
  }, []);
}

export function getSections(links: LinkItem[]): Section[] {
  return getGroups(links).map((title) => ({
    title,
    links: links.filter((link) => link.group === title),
  }));
}
