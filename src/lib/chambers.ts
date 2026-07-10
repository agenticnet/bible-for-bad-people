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
import type { Accent } from "@/components/ui/tokens";

export type ChamberStatus = "live" | "coming-soon";

export interface Chamber {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
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
    accent: "wine",
    status: "live",
    href: "/chat",
  },
  {
    id: "divine-support-desk",
    title: "The Divine Support Desk",
    description:
      "Submit prayers like IT support tickets. Receive automated, corporate-style responses from Heavenly Administration. Current queue time: 400 years.",
    icon: Ticket,
    accent: "slate",
    status: "live",
    href: "/support-desk",
  },
  {
    id: "devils-advocate",
    title: "Devil's Advocate Mode",
    description:
      "God busy? Chat with the competition. Lucifer is cynical, charismatic, and will absolutely hype up your worst decisions with terribly fun advice.",
    icon: Flame,
    accent: "plum",
    status: "live",
    href: "/devils-advocate",
  },
  {
    id: "oracle-of-doom",
    title: "Tarot / Oracle of Doom",
    description:
      "Daily readings that deliver brutally honest, pessimistic, or sarcastic fortunes. Zero toxic positivity. Maximum existential dread.",
    icon: Sparkles,
    accent: "plum",
    status: "live",
    href: "/oracle",
  },
  {
    id: "cynics-bible",
    title: "The Cynic's TL;DR Bible",
    description:
      "A searchable database of the weirdest, most violent, contradictory, and absurd passages your Sunday school definitely skipped.",
    icon: BookOpen,
    accent: "wine",
    status: "live",
    href: "/cynics-bible",
  },
  {
    id: "sin-translation",
    title: '"Sin" Translation Engine',
    description:
      'Type a petty thing you did. Get it translated into dramatic King James-style biblical prose. "I stole my coworker\'s lunch" → epic saga.',
    icon: ScrollText,
    accent: "terra",
    status: "live",
    href: "/sin-translator",
  },
  {
    id: "modern-indulgences",
    title: "Modern Indulgences",
    description:
      "A satirical digital marketplace. Buy certificates of Total Absolution or purchase your way onto the Least Likely to Go to Hell leaderboard.",
    icon: Crown,
    accent: "wine",
    status: "live",
    href: "/indulgences",
  },
  {
    id: "smite-button",
    title: "Smite Button",
    description:
      "Digitally smite minor inconveniences — traffic, your boss, that one neighbor — with classic plagues. Premium tier includes a cinematic smite description.",
    icon: Zap,
    accent: "ember",
    status: "live",
    href: "/smite",
  },
  {
    id: "confessional-leaderboard",
    title: "The Confessional Leaderboard",
    description:
      "An anonymous, Reddit-style feed for sins and grievances. The community votes to Absolve or Condemn. Democracy, but unhinged.",
    icon: Users,
    accent: "plum",
    status: "live",
    href: "/confessional",
  },
];
