import type { LucideIcon } from "lucide-react";
import {
  MessageCircle,
  Ticket,
  Flame,
  Sparkles,
  BookOpen,
  ScrollText,
  Crown,
  Zap,
  Users,
} from "lucide-react";

export type ChamberStatus = "live" | "coming-soon";

export interface Chamber {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: "purple" | "cyan" | "pink" | "gold" | "red";
  status: ChamberStatus;
  href?: string;
}

export const chambers: Chamber[] = [
  {
    id: "speak-with-god",
    title: "Speak with GOD",
    description:
      "Vent, question, and demand answers without traditional piety. No kneeling required. Freemium donations unlock customizable avatars — starting with Jesus Christ himself.",
    icon: MessageCircle,
    accent: "gold",
    status: "live",
    href: "/chat",
  },
  {
    id: "divine-support-desk",
    title: "The Divine Support Desk",
    description:
      "Submit prayers like IT support tickets. Receive automated, corporate-style responses from Heavenly Administration. Current queue time: 400 years.",
    icon: Ticket,
    accent: "cyan",
    status: "live",
    href: "/support-desk",
  },
  {
    id: "devils-advocate",
    title: "Devil's Advocate Mode",
    description:
      "God busy? Chat with the competition. Lucifer is cynical, charismatic, and will absolutely hype up your worst decisions with terribly fun advice.",
    icon: Flame,
    accent: "red",
    status: "live",
    href: "/devils-advocate",
  },
  {
    id: "oracle-of-doom",
    title: "Tarot / Oracle of Doom",
    description:
      "Daily readings that deliver brutally honest, pessimistic, or sarcastic fortunes. Zero toxic positivity. Maximum existential dread.",
    icon: Sparkles,
    accent: "purple",
    status: "live",
    href: "/oracle",
  },
  {
    id: "cynics-bible",
    title: "The Cynic's TL;DR Bible",
    description:
      "A searchable database of the weirdest, most violent, contradictory, and absurd passages your Sunday school definitely skipped.",
    icon: BookOpen,
    accent: "gold",
    status: "live",
    href: "/cynics-bible",
  },
  {
    id: "sin-translation",
    title: '"Sin" Translation Engine',
    description:
      'Type a petty thing you did. Get it translated into dramatic King James-style biblical prose. "I stole my coworker\'s lunch" → epic saga.',
    icon: ScrollText,
    accent: "pink",
    status: "live",
    href: "/sin-translator",
  },
  {
    id: "modern-indulgences",
    title: "Modern Indulgences",
    description:
      "A satirical digital marketplace. Buy certificates of Total Absolution or purchase your way onto the Least Likely to Go to Hell leaderboard.",
    icon: Crown,
    accent: "gold",
    status: "live",
    href: "/indulgences",
  },
  {
    id: "smite-button",
    title: "Smite Button",
    description:
      "Digitally smite minor inconveniences — traffic, your boss, that one neighbor — with classic plagues. Premium tier includes AI-generated smiting visuals.",
    icon: Zap,
    accent: "red",
    status: "live",
    href: "/smite",
  },
  {
    id: "confessional-leaderboard",
    title: "The Confessional Leaderboard",
    description:
      "An anonymous, Reddit-style feed for sins and grievances. The community votes to Absolve or Condemn. Democracy, but unhinged.",
    icon: Users,
    accent: "purple",
    status: "live",
    href: "/confessional",
  },
];

export const accentStyles = {
  purple: {
    icon: "text-plum",
    bg: "bg-plum/8",
    border: "border-plum/25",
    glow: "group-hover:border-plum/40",
  },
  cyan: {
    icon: "text-slate",
    bg: "bg-slate/8",
    border: "border-slate/25",
    glow: "group-hover:border-slate/40",
  },
  pink: {
    icon: "text-terra",
    bg: "bg-terra/8",
    border: "border-terra/25",
    glow: "group-hover:border-terra/40",
  },
  gold: {
    icon: "text-wine",
    bg: "bg-wine/8",
    border: "border-wine/25",
    glow: "group-hover:border-wine/40",
  },
  red: {
    icon: "text-ember",
    bg: "bg-ember/8",
    border: "border-ember/25",
    glow: "group-hover:border-ember/40",
  },
} as const;
