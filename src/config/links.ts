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

export type Section = {
  title: string;
  links: LinkItem[];
};

/**
 * Single source of truth for every tile on the start page. Layouts read this
 * flat list and group / slice it however they like. Edit here to add a service.
 */
export const links: LinkItem[] = [
  {
    name: "FinLens",
    description: "Personal finance dashboard",
    href: "https://en.wikipedia.org/wiki/Personal_finance",
    previewImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
    icon: ChartNoAxesCombined,
    group: "Apps",
    badge: "App",
    status: "online",
  },
  {
    name: "HouseBot",
    description: "Home automation hub",
    href: "https://www.home-assistant.io",
    previewImage:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    icon: Bot,
    group: "Apps",
    badge: "App",
    status: "online",
  },
  {
    name: "ApplyBot",
    description: "Job application tracker",
    href: "https://www.linkedin.com/jobs/",
    previewImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80",
    icon: Send,
    group: "Apps",
    badge: "App",
    status: "idle",
  },
  {
    name: "Plex",
    description: "Media library & streaming",
    href: "https://www.plex.tv",
    previewImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    icon: Film,
    group: "Apps",
    badge: "Media",
    status: "online",
    newTab: true,
  },
  {
    name: "Auth",
    description: "Identity provider",
    href: "https://auth0.com",
    icon: KeyRound,
    group: "Infra",
    badge: "Infra",
    status: "online",
    newTab: true,
  },
  {
    name: "Uptime Kuma",
    description: "Service monitoring",
    href: "https://uptime.kuma.pet",
    icon: HeartPulse,
    group: "Infra",
    badge: "Infra",
    status: "online",
    newTab: true,
  },
  {
    name: "Portainer",
    description: "Container management",
    href: "https://www.portainer.io",
    icon: Container,
    group: "Infra",
    badge: "Infra",
    status: "online",
    newTab: true,
  },
  {
    name: "Proxmox",
    description: "Virtualization host",
    href: "https://www.proxmox.com",
    icon: HardDrive,
    group: "Infra",
    badge: "Infra",
    status: "online",
    newTab: true,
  },
  {
    name: "Pi-hole",
    description: "Network-wide DNS & ad block",
    href: "https://pi-hole.net",
    icon: Network,
    group: "Infra",
    badge: "Infra",
    status: "idle",
    newTab: true,
  },
  {
    name: "Grafana",
    description: "Metrics & observability",
    href: "https://grafana.com",
    icon: Gauge,
    group: "Infra",
    badge: "Infra",
    status: "online",
    newTab: true,
  },
];

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
