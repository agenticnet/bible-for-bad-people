"use client";

import { Flame } from "lucide-react";
import { Callout } from "@/components/ui";
import ChamberChatInterface from "@/components/chat/ChamberChatInterface";
import type { ChamberMessage } from "@/lib/chatTypes";
import { INITIAL_LUCIFER_MESSAGE } from "@/lib/chatTypes";
import { getRandomLuciferResponse } from "@/lib/mockLuciferResponses";

const luciferChatConfig = {
  channel: "lucifer" as const,
  assistantRole: "lucifer" as const,
  accent: "plum" as const,
  initialMessage: INITIAL_LUCIFER_MESSAGE,
  getMockResponse: getRandomLuciferResponse,
  mapStoredMessage: (m: ChamberMessage): ChamberMessage => ({
    id: m.id,
    role: m.role === "user" ? "user" : "lucifer",
    content: m.content,
    timestamp: m.timestamp,
  }),
  header: {
    avatar: <Flame className="h-5 w-5" />,
    title: "Devil's Advocate Mode",
    status: "Online — Enabling poor choices",
    badge: "Counsel from below",
  },
  authGate: {
    title: "Sign in to chat with Lucifer",
    description:
      "Read his pitch for free. Log in to get terrible advice and save the transcript.",
  },
  composer: {
    placeholder: "What's the worst idea you're considering?",
    hint: "Enter to send.",
  },
  bubbles: {
    assistantAvatar: "😈",
    userAvatar: "🙂",
    assistantLabel: "LUCIFER",
    typingLabel: "Lucifer is typing...",
  },
  preamble: (
    <Callout tone="ember" className="mb-4 text-sm">
      Lucifer is not a licensed attorney, therapist, or moral compass. Proceed
      accordingly.
    </Callout>
  ),
};

export default function LuciferChatInterface() {
  return <ChamberChatInterface config={luciferChatConfig} />;
}
