export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export const primaryNavLinks: NavLink[] = [
  { href: "/#chambers", label: "The Chambers" },
  { href: "/chat", label: "Speak with GOD" },
];

export const chamberNavGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Confession & Prophecy",
    links: [
      { href: "/chat", label: "Speak with GOD", description: "Vent to the divine" },
      { href: "/devils-advocate", label: "Devil's Advocate", description: "Chat with Lucifer" },
      { href: "/oracle", label: "Oracle of Doom", description: "Daily tarot readings" },
    ],
  },
  {
    title: "Scripture & Translation",
    links: [
      { href: "/support-desk", label: "Divine Support Desk", description: "Prayer tickets" },
      { href: "/cynics-bible", label: "Cynic's TL;DR Bible", description: "Skipped verses" },
      { href: "/sin-translator", label: "Sin Translation Engine", description: "King James sins" },
    ],
  },
  {
    title: "Indulgences & Wrath",
    links: [
      { href: "/indulgences", label: "Modern Indulgences", description: "Buy absolution" },
      { href: "/smite", label: "Smite Button", description: "Deploy plagues" },
      { href: "/confessional", label: "Confessional Leaderboard", description: "Absolve or condemn" },
    ],
  },
];

export const allChamberLinks: NavLink[] = chamberNavGroups.flatMap((g) => g.links);
