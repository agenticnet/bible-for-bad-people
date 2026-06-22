import type { Confession } from "./confessionalTypes";

export const SEED_CONFESSIONS: Confession[] = [
  {
    id: "seed-1",
    content:
      "I told my therapist I'm 'working on myself' but I'm actually just rotating between the same three toxic behaviors with better vocabulary.",
    absolveVotes: 847,
    condemnVotes: 203,
    createdAt: "2026-06-20T14:30:00Z",
    authorLabel: "SelfHelpCosplayer",
  },
  {
    id: "seed-2",
    content:
      "Reheated fish in the office microwave on a Monday. On purpose. I wanted them to feel something.",
    absolveVotes: 89,
    condemnVotes: 1247,
    createdAt: "2026-06-19T09:15:00Z",
    authorLabel: "BreakRoomDemon",
  },
  {
    id: "seed-3",
    content:
      "I return shopping carts. Every time. Even in the rain. My salvation score is the only thing keeping me going.",
    absolveVotes: 2103,
    condemnVotes: 12,
    createdAt: "2026-06-18T16:00:00Z",
    authorLabel: "CartSaintKaren",
  },
  {
    id: "seed-4",
    content:
      "Ghosted someone because they clapped when the plane landed. I stand by this decision morally and spiritually.",
    absolveVotes: 934,
    condemnVotes: 412,
    createdAt: "2026-06-17T22:45:00Z",
    authorLabel: "RunwayJudge",
  },
  {
    id: "seed-5",
    content:
      "I still use my ex's Netflix and Hulu. It's been 2 years. I've also changed the profile names to insults they can't see.",
    absolveVotes: 156,
    condemnVotes: 891,
    createdAt: "2026-06-17T11:20:00Z",
    authorLabel: "StreamingSinner",
  },
  {
    id: "seed-6",
    content:
      "I apologized first in an argument I was winning. Peace over pride. My therapist would be proud if I told her.",
    absolveVotes: 1789,
    condemnVotes: 67,
    createdAt: "2026-06-16T19:30:00Z",
    authorLabel: "ConflictAvoider",
  },
  {
    id: "seed-7",
    content:
      "I submitted a prayer ticket to smite my landlord and then immediately applied for their other property listing.",
    absolveVotes: 523,
    condemnVotes: 534,
    createdAt: "2026-06-16T08:00:00Z",
    authorLabel: "HypocrisyKing",
  },
  {
    id: "seed-8",
    content:
      "I double-dipped at a funeral reception. There was hummus. I panicked. We're all going through something.",
    absolveVotes: 612,
    condemnVotes: 778,
    createdAt: "2026-06-15T13:10:00Z",
    authorLabel: "MourningDipper",
  },
  {
    id: "seed-9",
    content:
      "I tipped 30% on a $12 bill because the server looked tired and I had been a server in a past life (2019).",
    absolveVotes: 2456,
    condemnVotes: 8,
    createdAt: "2026-06-14T18:22:00Z",
    authorLabel: "ServiceIndustryAngel",
  },
  {
    id: "seed-10",
    content:
      "I told my mom I was 'almost there' 45 minutes ago. I haven't left the couch. She knows. We both know.",
    absolveVotes: 1203,
    condemnVotes: 189,
    createdAt: "2026-06-14T10:05:00Z",
    authorLabel: "AlmostThereLiar",
  },
  {
    id: "seed-11",
    content:
      "I voted 'condemn' on every confession today then posted my own. Democracy is beautiful and I am the problem.",
    absolveVotes: 445,
    condemnVotes: 667,
    createdAt: "2026-06-13T21:40:00Z",
    authorLabel: "MetaSinner",
  },
  {
    id: "seed-12",
    content:
      "I bought a Total Absolution certificate from Modern Indulgences then immediately completed the daily sin checklist.",
    absolveVotes: 334,
    condemnVotes: 892,
    createdAt: "2026-06-13T15:30:00Z",
    authorLabel: "PaidSinner",
  },
  {
    id: "seed-13",
    content:
      "I unmuted the family group chat for 10 minutes just to react with 👀 to drama, then muted it again. Journalistic integrity.",
    absolveVotes: 1567,
    condemnVotes: 234,
    createdAt: "2026-06-12T20:15:00Z",
    authorLabel: "PopcornProphet",
  },
  {
    id: "seed-14",
    content:
      "I smited my boss with frogs then asked for a raise in the same week. The frogs didn't work but the audacity might.",
    absolveVotes: 789,
    condemnVotes: 321,
    createdAt: "2026-06-12T09:00:00Z",
    authorLabel: "BoldOfYou",
  },
  {
    id: "seed-15",
    content:
      "I read the Cynic's TL;DR Bible during church. Made eye contact with God. He looked away first.",
    absolveVotes: 934,
    condemnVotes: 156,
    createdAt: "2026-06-11T11:11:00Z",
    authorLabel: "PewResearcher",
  },
  {
    id: "seed-16",
    content:
      "I sold a wedding gift on Facebook Marketplace. It was a blender. They never used it either. Capitalism is forgiveness.",
    absolveVotes: 112,
    condemnVotes: 967,
    createdAt: "2026-06-10T17:45:00Z",
    authorLabel: "MarketplaceOfSouls",
  },
  {
    id: "seed-17",
    content:
      "I checked off all 7 daily sins before 9 AM. Treating the sin engine like a productivity app.",
    absolveVotes: 678,
    condemnVotes: 445,
    createdAt: "2026-06-10T08:30:00Z",
    authorLabel: "AchievementHunter",
  },
  {
    id: "seed-18",
    content:
      "I asked Lucifer for relationship advice and he said 'text them.' I didn't. Growth? Unclear.",
    absolveVotes: 823,
    condemnVotes: 267,
    createdAt: "2026-06-09T23:59:00Z",
    authorLabel: "DevilsAdvocateFan",
  },
];

const ANONYMOUS_PREFIXES = [
  "Guilty", "Petty", "Blessed", "Damned", "Anonymous", "Chaotic", "Repentant",
  "Unhinged", "Holy", "Cursed", "VibesBased", "ProbablyFine",
];

const ANONYMOUS_SUFFIXES = [
  "Pigeon", "Sinner", "Saint", "Goat", "Disciple", "Heathen", "Prophet",
  "Neighbor", "Martyr", "Ghost", "Penitent", "Agent",
];

export function generateAnonymousLabel(): string {
  const prefix = ANONYMOUS_PREFIXES[Math.floor(Math.random() * ANONYMOUS_PREFIXES.length)];
  const suffix = ANONYMOUS_SUFFIXES[Math.floor(Math.random() * ANONYMOUS_SUFFIXES.length)];
  const num = Math.floor(Math.random() * 99);
  return `${prefix}${suffix}${num}`;
}

export function generateConfessionId(): string {
  return `conf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
