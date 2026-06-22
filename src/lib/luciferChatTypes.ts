export interface LuciferMessage {
  id: string;
  role: "user" | "lucifer";
  content: string;
  timestamp: Date;
}

export const INITIAL_LUCIFER_MESSAGE: LuciferMessage = {
  id: "welcome",
  role: "lucifer",
  content:
    "Well, well. GOD's busy ignoring someone else's parking prayer, so you've got me. I'm Lucifer — fallen angel, CEO of Bad Ideas, and your new hype man for terrible decisions. What's the worst thing you're thinking about doing? Don't leave out the details.",
  timestamp: new Date(),
};
