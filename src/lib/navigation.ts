import { chambers } from "./chambers";

export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export const primaryNavLinks: NavLink[] = [
  { href: "/#chambers", label: "The Chambers" },
];

const NAV_LABELS: Record<string, string> = {
  "speak-with-god": "Speak with GOD",
  "devils-advocate": "Devil's Advocate",
  "oracle-of-doom": "Oracle of Doom",
  "divine-support-desk": "Divine Support Desk",
  "cynics-bible": "Cynic's TL;DR Bible",
  "sin-translation": "Sin Translation Engine",
  "modern-indulgences": "Modern Indulgences",
  "smite-button": "Smite Button",
  "confessional-leaderboard": "Confessional Leaderboard",
};

const CHAMBER_NAV_GROUPS: {
  title: string;
  items: { id: string; description: string }[];
}[] = [
  {
    title: "Confession & Prophecy",
    items: [
      { id: "speak-with-god", description: "Vent to the divine" },
      { id: "devils-advocate", description: "Chat with Lucifer" },
      { id: "oracle-of-doom", description: "Daily tarot readings" },
    ],
  },
  {
    title: "Scripture & Translation",
    items: [
      { id: "divine-support-desk", description: "Prayer tickets" },
      { id: "cynics-bible", description: "Skipped verses" },
      { id: "sin-translation", description: "King James sins" },
    ],
  },
  {
    title: "Indulgences & Wrath",
    items: [
      { id: "modern-indulgences", description: "Buy absolution" },
      { id: "smite-button", description: "Deploy plagues" },
      { id: "confessional-leaderboard", description: "Absolve or condemn" },
    ],
  },
];

function chamberLink(id: string, description: string): NavLink {
  const chamber = chambers.find((c) => c.id === id);
  if (!chamber?.href) {
    throw new Error(`Chamber ${id} missing href`);
  }
  return {
    href: chamber.href,
    label: NAV_LABELS[id] ?? chamber.title,
    description,
  };
}

export const chamberNavGroups: { title: string; links: NavLink[] }[] =
  CHAMBER_NAV_GROUPS.map((group) => ({
    title: group.title,
    links: group.items.map((item) => chamberLink(item.id, item.description)),
  }));
