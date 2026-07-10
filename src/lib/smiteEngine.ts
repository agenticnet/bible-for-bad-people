import type { PlagueType, SmiteTarget } from "./smiteTypes";

const PLAGUE_DESCRIPTIONS: Record<PlagueType, string> = {
  locusts:
    "A swarm of locusts descended upon their domain, consuming everything in sight — including their patience and probably their garden.",
  frogs:
    "Frogs. Everywhere. In their shoes, their bed, their coffee. The croaking shall not cease until justice is felt.",
  boils:
    "Painful boils appeared upon their skin — or at least upon their spirit. Dermatologists are booked through next month.",
  darkness:
    "Three days of thick darkness fell upon their household. They stumbled into furniture and questioned their life choices.",
  hail:
    "Fire mixed with hail rained down upon their commute. Insurance claims have been filed. God remains unverified.",
  pestilence:
    "A general pestilence of inconvenience: mild illness, cancelled plans, and everything tasting slightly off.",
  "blood-river":
    "Their water turned to blood — or at least their tap ran brown for an alarming minute. Plumbing bills incoming.",
  gnats:
    "Gnats filled every room, every orifice of their home. Screens mean nothing. Hope means less.",
  "livestock-death":
    "All their livestock perished — or in modern terms, their houseplants died simultaneously and their sourdough starter failed.",
  "firstborn-wifi":
    "The WiFi of the firstborn device in their household went out for exactly 40 minutes during peak streaming hours.",
};

const TARGET_PREFIX: Record<SmiteTarget, (name: string) => string> = {
  traffic: (n) => `Upon the cursed highway where ${n} dwells in eternal gridlock`,
  boss: (n) => `Upon ${n}, who hath made thy work life a living testament to suffering`,
  neighbor: (n) => `Upon ${n}, keeper of loud music and leaf blowers at dawn`,
  landlord: (n) => `Upon ${n}, who hath withheld repairs and raised rent like Pharaoh raised taxes`,
  ex: (n) => `Upon ${n}, who left thy texts on read and thy heart in ruins`,
  "slow-walker": (n) => `Upon ${n}, who blocketh the sidewalk as if they own the pavement`,
  coworker: (n) => `Upon ${n}, speaker of 'per my last email' and reheater of fish`,
  customer: (n) => `Upon ${n}, who demandeth to speak to the manager of the universe`,
  custom: (n) => `Upon ${n}, who hath wronged thee in ways both petty and profound`,
};

const PREMIUM_VISUALS: Record<PlagueType, string> = {
  locusts:
    "A biblical swarm of locusts descends on a Prius stuck in traffic. Dashboard cam footage. 4K wrath.",
  frogs:
    "Thousands of frogs pour from an office elevator as your boss arrives for a board meeting. Slow motion. Cinematic.",
  boils:
    "Close-up of boils forming on a landlord's forehead during a tenant inspection. Horror lighting. Uncomfortable.",
  darkness:
    "Your neighbor's house goes pitch black mid-birthday party. Confused screaming. Found footage aesthetic.",
  hail:
    "Golf-ball hail destroys a slow walker's umbrella while they text in the middle of the crosswalk. Justice.",
  pestilence:
    "Your ex opens a dating app to find every match has the same plague emoji bio. Wide shot. Tragic.",
  "blood-river":
    "A suburban kitchen faucet runs crimson. The terrible customer from aisle 7 watches in the reflection.",
  gnats:
    "Gnats form the word 'PETTY' in the air above your coworker's standing desk. Drone shot. Divine.",
  "livestock-death":
    "Houseplants wilt in synchronized agony across a Zoom grid of annoying meeting attendees.",
  "firstborn-wifi":
    "Router lights blink red as a teenager realizes Fortnite is offline during a ranked match. Documentary style.",
};

const DEFAULT_NAMES: Record<SmiteTarget, string> = {
  traffic: "the accursed morning commute",
  boss: "thy manager",
  neighbor: "the neighbor with the leaf blower",
  landlord: "thy landlord",
  ex: "thine ex",
  "slow-walker": "the sidewalk blocker",
  coworker: "the reply-all enthusiast",
  customer: "Karen of the retail aisle",
  custom: "thine enemy",
};

export function getTargetName(target: SmiteTarget, customName?: string): string {
  if (target === "custom" && customName?.trim()) return customName.trim();
  return DEFAULT_NAMES[target];
}

export function generateSmiteResult(
  target: SmiteTarget,
  plague: PlagueType,
  customName?: string,
  premium?: boolean
): { result: string; visualDescription?: string } {
  const name = getTargetName(target, customName);
  const prefix = TARGET_PREFIX[target](name);
  const plagueDesc = PLAGUE_DESCRIPTIONS[plague];

  const result = `${prefix}, the LORD hath unleashed ${plague.replace(/-/g, " ")}. ${plagueDesc} Smite ID logged. Effectiveness: unverified but spiritually satisfying.`;

  return {
    result,
    visualDescription: premium ? PREMIUM_VISUALS[plague] : undefined,
  };
}

export function generateSmiteId(): string {
  return `SMT-${Math.floor(Math.random() * 900000) + 100000}`;
}
