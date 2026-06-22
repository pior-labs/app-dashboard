import type { LucideIcon } from "lucide-react";
import { Bot, ChartNoAxesCombined, Container, HeartPulse, KeyRound, Send } from "lucide-react";

export type LinkItem = {
  name: string;
  description?: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  newTab?: boolean;
};

export type Section = {
  title: string;
  links: LinkItem[];
};

export const sections: Section[] = [
  {
    title: "Apps",
    links: [
      {
        name: "FinLens",
        description: "Finance dashboard",
        href: "https://finlens.example.com",
        icon: ChartNoAxesCombined,
        badge: "App",
      },
      {
        name: "HouseBot",
        description: "Home assistant",
        href: "https://housebot.example.com",
        icon: Bot,
        badge: "App",
      },
      {
        name: "ApplyBot",
        description: "Application tracker",
        href: "https://applybot.example.com",
        icon: Send,
        badge: "App",
      },
    ],
  },
  {
    title: "Infra",
    links: [
      {
        name: "Auth",
        description: "Identity provider",
        href: "https://auth.example.com",
        icon: KeyRound,
        badge: "Infra",
        newTab: true,
      },
      {
        name: "Uptime Kuma",
        description: "Service monitoring",
        href: "https://uptime.example.com",
        icon: HeartPulse,
        badge: "Infra",
        newTab: true,
      },
      {
        name: "Portainer",
        description: "Container management",
        href: "https://portainer.example.com",
        icon: Container,
        badge: "Infra",
        newTab: true,
      },
    ],
  },
];
