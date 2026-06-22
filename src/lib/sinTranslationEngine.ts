const OPENINGS = [
  "And it came to pass that",
  "Verily, verily, I say unto thee:",
  "Lo, in the hour of thy weakness,",
  "Hearken unto the record of thy deed:",
  "Thus it was written when thou didst commit:",
];

const CLOSINGS = [
  "And the heavens remained unmoved.",
  "The angels sighed, but made no comment.",
  "It was petty, yet it was thine.",
  "So it was logged in the book of minor transgressions.",
  "Repentance is optional; the story is not.",
  "The LORD saw it, and probably related.",
];

const VERB_REPLACEMENTS: [RegExp, string][] = [
  [/\bstole\b/gi, "didst covet and take"],
  [/\bsteal\b/gi, "covet and take"],
  [/\blied\b/gi, "spoke falsely"],
  [/\blie\b/gi, "speak falsely"],
  [/\bghosted\b/gi, "didst vanish from"],
  [/\bignored\b/gi, "didst turn thine eyes from"],
  [/\bate\b/gi, "didst consume"],
  [/\beat\b/gi, "consume"],
  [/\bsaid\b/gi, "spake unto them"],
  [/\btold\b/gi, "declared unto"],
  [/\bposted\b/gi, "didst publish upon the timeline"],
  [/\btexted\b/gi, "didst send a missive unto"],
  [/\bcopied\b/gi, "didst transcribe the works of another"],
  [/\bborrowed\b/gi, "received on loan — and kept"],
  [/\bflaked\b/gi, "didst abandon thy covenant of plans"],
  [/\bcomplained\b/gi, "didst murmur against"],
  [/\breheated\b/gi, "didst warm again in the microwave of judgment"],
  [/\bsnoozed\b/gi, "didst reject the trumpet of dawn"],
  [/\bpretended\b/gi, "didst feign"],
  [/\bused\b/gi, "didst make use of"],
  [/\bleft\b/gi, "didst depart from without answering"],
  [/\bmy\b/gi, "thy"],
  [/\bI\b/g, "thou"],
  [/\bme\b/gi, "thee"],
  [/\bI'm\b/gi, "thou art"],
  [/\bI've\b/gi, "thou hast"],
  [/\bdidn't\b/gi, "didst not"],
  [/\bdon't\b/gi, "dost not"],
  [/\bcan't\b/gi, "canst not"],
  [/\bwon't\b/gi, "wilt not"],
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function embellish(text: string): string {
  let result = text.trim();
  if (!result.endsWith(".")) result += ".";
  for (const [pattern, replacement] of VERB_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function translatePettySin(petty: string): string {
  const trimmed = petty.trim();
  if (!trimmed) {
    return "Thou didst attempt to confess nothing — and even that is suspicious.";
  }

  const opening = pickRandom(OPENINGS);
  const embellished = embellish(trimmed);
  const closing = pickRandom(CLOSINGS);

  if (opening.endsWith(":")) {
    return `${opening} ${embellished.charAt(0).toLowerCase()}${embellished.slice(1)} ${closing}`;
  }

  return `${opening} ${embellished.charAt(0).toLowerCase()}${embellished.slice(1)}. ${closing}`;
}

export function generateSinId(): string {
  return `sin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
