import type { DoomCard, DailyReading } from "./oracleTypes";

export const DOOM_DECK: DoomCard[] = [
  {
    id: "fool-reversed",
    name: "The Fool (Reversed)",
    symbol: "🃏",
    omen: "chaotic",
    tagline: "Same mistakes, new calendar year.",
    reading:
      "You haven't learned a single thing and honestly? The universe respects the commitment. Today you'll repeat a pattern you swore you'd break. At least you're consistent.",
  },
  {
    id: "tower",
    name: "The Tower",
    symbol: "🗼",
    omen: "doomed",
    tagline: "Everything you built was on sand. Wet sand.",
    reading:
      "Something is coming down — a plan, a relationship, your sleep schedule. Don't fight it. Watch it collapse with the quiet dignity of someone who saw it coming and did nothing.",
  },
  {
    id: "death",
    name: "Death",
    symbol: "💀",
    omen: "bleak",
    tagline: "Transformation! Into something worse.",
    reading:
      "An ending approaches. Could be a chapter, a habit, or your will to check email. Whatever dies today needed to go. You'll still complain about it.",
  },
  {
    id: "ace-anxiety",
    name: "Ace of Anxiety",
    symbol: "⚡",
    omen: "cursed",
    tagline: "A fresh worry enters the chat.",
    reading:
      "Something new to overthink about arrives before noon. It will be completely out of your control and 100% your problem mentally. Congratulations.",
  },
  {
    id: "ten-of-bills",
    name: "Ten of Bills",
    symbol: "💸",
    omen: "doomed",
    tagline: "Money sees you. It is not impressed.",
    reading:
      "Financial chaos lurks. A subscription you forgot, an impulse purchase, or simply 'existing.' The cards suggest checking your bank account. Then crying. Then checking again.",
  },
  {
    id: "eight-of-ghosting",
    name: "Eight of Ghosting",
    symbol: "👻",
    omen: "bleak",
    tagline: "They're not coming back.",
    reading:
      "Someone you keep checking on has moved on. The Oracle suggests you do the same. Put down the phone. They saw your story and chose silence. Brutal. Accurate.",
  },
  {
    id: "wheel-of-misfortune",
    name: "Wheel of Misfortune",
    symbol: "🎡",
    omen: "chaotic",
    tagline: "What's up must come down. Hard.",
    reading:
      "A recent win was temporary. The wheel spins back toward inconvenience, awkward encounters, or a printer jam at the worst possible moment. Buckle up. Or don't. Free will is a myth.",
  },
  {
    id: "queen-of-petty",
    name: "Queen of Petty",
    symbol: "👑",
    omen: "cursed-blessing",
    tagline: "Small revenge. Big consequences.",
    reading:
      "You'll be tempted to do something petty today. It will feel incredible for eleven minutes. The fallout lasts considerably longer. The Oracle is not telling you not to — just forecasting.",
  },
  {
    id: "hermit-reversed",
    name: "The Hermit (Reversed)",
    symbol: "🏚️",
    omen: "bleak",
    tagline: "Your alone time is permanent.",
    reading:
      "Isolation isn't a phase — it's a lifestyle you're accidentally committing to. Cancel plans if you want. They might not notice. The cards say stay in. You were going to anyway.",
  },
  {
    id: "devil-its-me",
    name: "The Devil (It's You)",
    symbol: "😈",
    omen: "cursed",
    tagline: "Plot twist: you're the problem.",
    reading:
      "The conflict you've been blaming on others? The cards have reviewed the evidence. Verdict: user error. Self-awareness is available today at a steep emotional cost.",
  },
  {
    id: "two-of-cups-empty",
    name: "Two of Cups (Empty)",
    symbol: "🥂",
    omen: "bleak",
    tagline: "Love is... complicated. By you.",
    reading:
      "Romance today is a minefield of mixed signals — mostly yours. If you're single, the cards predict awkward eye contact. If you're not, a 'we need to talk' energy lingers.",
  },
  {
    id: "chariot-broken",
    name: "The Chariot (Broken Down)",
    symbol: "🛞",
    omen: "doomed",
    tagline: "Forward motion: stalled.",
    reading:
      "Progress on your goals hits a wall. Could be motivation, could be traffic, could be the crushing weight of existence. The Oracle recommends lowering expectations to floor level.",
  },
  {
    id: "judgement-delayed",
    name: "Judgement (Delayed)",
    symbol: "⏳",
    omen: "chaotic",
    tagline: "Verdict pending. Don't hold your breath.",
    reading:
      "Something you've been waiting on — a reply, a result, an apology — will not arrive today. Or tomorrow. The universe is on cosmic hold. So are you, apparently.",
  },
  {
    id: "star-dead",
    name: "The Star (Dead)",
    symbol: "⭐",
    omen: "bleak",
    tagline: "Hope is not on the menu.",
    reading:
      "Toxic positivity has been banished from this reading. Things are mid at best. The only light at the end of the tunnel might be a train. Plan accordingly.",
  },
  {
    id: "five-of-regret",
    name: "Five of Regret",
    symbol: "😮‍💨",
    omen: "cursed",
    tagline: "Past you screwed present you. Again.",
    reading:
      "An old decision resurfaces — a text, a photo, a memory, a debt. Past you had no foresight. Present you has no patience. Future you is already disappointed.",
  },
  {
    id: "moon-waning",
    name: "The Moon (Waning)",
    symbol: "🌑",
    omen: "chaotic",
    tagline: "Illusions fade. Reality is worse.",
    reading:
      "Something you believed about a person or situation gets exposed today. The truth is uglier than the lie. The Oracle offers no comfort, only accuracy.",
  },
  {
    id: "world-on-fire",
    name: "The World (On Fire)",
    symbol: "🌍",
    omen: "doomed",
    tagline: "Everything is connected. Everything is burning.",
    reading:
      "Global chaos bleeds into personal chaos. You'll doomscroll, feel helpless, then make it about yourself. The cards understand. They're tired too.",
  },
  {
    id: "three-of-swords",
    name: "Three of Swords",
    symbol: "🗡️",
    omen: "bleak",
    tagline: "Heartbreak is your brand now.",
    reading:
      "Emotional damage — minor or major — is on the forecast. Could be a comment, a memory, or your own brain at 3 AM. Stay hydrated. Feelings are temporary. Mostly.",
  },
  {
    id: "emperors-new-job",
    name: "The Emperor's New Job",
    symbol: "💼",
    omen: "cursed-blessing",
    tagline: "Fake it till HR fires you.",
    reading:
      "Workplace chaos today. You'll pretend to know what you're doing. So will everyone else. The entire economy is held together by confidence and caffeine.",
  },
  {
    id: "high-priestess-unavailable",
    name: "The High Priestess (Unavailable)",
    symbol: "🔮",
    omen: "chaotic",
    tagline: "Intuition is on Do Not Disturb.",
    reading:
      "Your gut feeling is wrong today. Whatever instinct you trust most will lead you astray. The Oracle suggests flipping a coin. Same odds, less drama.",
  },
];

const DOOM_SUMMARIES = [
  "Today is a {score}/10 on the Doom Scale. The cards have spoken, and they're not optimistic. Proceed with low expectations and a charged phone.",
  "The universe has reviewed your file. Verdict: chaotic neutral leaning doomed. {score}/10 doom. Good luck out there.",
  "Your daily forecast: mostly cloudy with a 90% chance of inconvenience. Doom score: {score}/10. Dress accordingly (emotionally).",
  "The Oracle sees petty decisions, minor heartbreak, and one moment where you almost get it together — then don't. Doom: {score}/10.",
  "Today's energy: {score}/10 on the existential dread meter. The cards suggest coffee, boundaries, and lowering the bar.",
  "Cosmic outlook: bleak with scattered chaos. Doom score {score}/10. Your horoscope app is lying to you. We aren't.",
];

function hashDate(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickCards(dateKey: string, count: number): DoomCard[] {
  const hash = hashDate(dateKey);
  const deck = [...DOOM_DECK];
  const picked: DoomCard[] = [];

  for (let i = 0; i < count; i++) {
    const index = (hash + i * 7) % deck.length;
    picked.push(deck[index]);
    deck.splice(index, 1);
  }

  return picked;
}

export function getDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function generateDailyReading(dateKey: string): Omit<DailyReading, "revealed"> {
  const cards = pickCards(dateKey, 3);
  const hash = hashDate(dateKey);
  const doomScore = (hash % 4) + 6; // 6–9, always pretty doom-y
  const summaryTemplate = DOOM_SUMMARIES[hash % DOOM_SUMMARIES.length];
  const summary = summaryTemplate.replace("{score}", String(doomScore));

  return { dateKey, cards, doomScore, summary };
}

export const STORAGE_KEY_PREFIX = "oracle-doom";

export function loadReading(dateKey: string): DailyReading | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}-${dateKey}`);
    return raw ? (JSON.parse(raw) as DailyReading) : null;
  } catch {
    return null;
  }
}

export function saveReading(reading: DailyReading): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}-${reading.dateKey}`,
      JSON.stringify(reading)
    );
  } catch {
    // ignore storage errors
  }
}
