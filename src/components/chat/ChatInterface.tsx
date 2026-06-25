"use client";

import ChamberChatInterface from "./ChamberChatInterface";
import { INITIAL_GOD_MESSAGE } from "@/lib/chatTypes";
import { getRandomGodResponse } from "@/lib/mockResponses";

const godChatConfig = {
  channel: "god" as const,
  assistantRole: "god" as const,
  accent: "wine" as const,
  initialMessage: INITIAL_GOD_MESSAGE,
  getMockResponse: getRandomGodResponse,
  header: {
    avatar: <span className="text-xl">✝</span>,
    title: "Speak with GOD",
    status: "Online — Judging silently",
  },
  authGate: {
    title: "Sign in to speak with GOD",
    description:
      "The welcome message is free. Log in to vent, confess, and keep your chat on the ledger.",
  },
  composer: {
    placeholder: "Confess, vent, or demand a miracle...",
    hint: "Mock responses only. Enter to send, Shift+Enter for new line.",
  },
  bubbles: {
    assistantAvatar: "✝",
    userAvatar: "😈",
    assistantLabel: "GOD",
    typingLabel: "GOD is typing...",
  },
};

export default function ChatInterface() {
  return <ChamberChatInterface config={godChatConfig} />;
}
