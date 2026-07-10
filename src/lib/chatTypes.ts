import type { ReactNode } from "react";
import type { Accent } from "@/components/ui/tokens";

export type ChatChannel = "god" | "lucifer";

export type ChamberMessageRole = "user" | "god" | "lucifer";

export interface ChamberMessage {
  id: string;
  role: ChamberMessageRole;
  content: string;
  timestamp: Date;
}

/** @deprecated Use ChamberMessage */
export type Message = ChamberMessage;

export const INITIAL_GOD_MESSAGE: ChamberMessage = {
  id: "welcome",
  role: "god",
  content:
    "Ah, another soul seeking answers. I was just watching a TikTok about locusts. What do you want? And make it interesting — I've heard every prayer about parking spots.",
  timestamp: new Date(),
};

export const INITIAL_LUCIFER_MESSAGE: ChamberMessage = {
  id: "welcome",
  role: "lucifer",
  content:
    "Well, well. GOD's busy ignoring someone else's parking prayer, so you've got me. I'm Lucifer — fallen angel, CEO of Bad Ideas, and your new hype man for terrible decisions. What's the worst thing you're thinking about doing? Don't leave out the details.",
  timestamp: new Date(),
};

export interface ChamberChatConfig {
  channel: ChatChannel;
  assistantRole: Exclude<ChamberMessageRole, "user">;
  accent: Accent;
  userAccent?: Accent;
  initialMessage: ChamberMessage;
  getMockResponse: () => string;
  mapStoredMessage?: (stored: ChamberMessage) => ChamberMessage;
  header: {
    avatar: ReactNode;
    title: string;
    status: string;
    badge?: string;
  };
  authGate: {
    title: string;
    description: string;
  };
  composer: {
    placeholder: string;
    hint: string;
  };
  bubbles: {
    assistantAvatar: string;
    userAvatar: string;
    assistantLabel: string;
    typingLabel: string;
  };
  preamble?: ReactNode;
}
