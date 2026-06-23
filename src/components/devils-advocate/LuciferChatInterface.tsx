"use client";

import { useState, useRef, useEffect } from "react";
import { Flame } from "lucide-react";
import {
  Callout,
  ChatComposer,
  ChatHeader,
  ChatShell,
  MessageBubble,
  TypingIndicator,
} from "@/components/ui";
import type { LuciferMessage } from "@/lib/luciferChatTypes";
import { INITIAL_LUCIFER_MESSAGE } from "@/lib/luciferChatTypes";
import { getRandomLuciferResponse } from "@/lib/mockLuciferResponses";

export default function LuciferChatInterface() {
  const [messages, setMessages] = useState<LuciferMessage[]>([
    INITIAL_LUCIFER_MESSAGE,
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: LuciferMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const luciferMessage: LuciferMessage = {
        id: `lucifer-${Date.now()}`,
        role: "lucifer",
        content: getRandomLuciferResponse(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, luciferMessage]);
      setIsTyping(false);
    }, 1000);
  }

  return (
    <ChatShell
      header={
        <ChatHeader
          accent="ember"
          avatar={<Flame className="h-6 w-6" />}
          title="Devil's Advocate Mode"
          status="Lucifer — Online & enabling poor choices"
          badge="Visions Approximate"
          online={false}
        />
      }
      banner={
        <Callout tone="ember" className="rounded-none border-x-0 text-center text-[11px]">
          GOD is currently unavailable. You are now chatting with the competition.
          Lucifer does not offer salvation, refunds, or good advice.
        </Callout>
      }
      composer={
        <ChatComposer
          accent="ember"
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          disabled={isTyping}
          placeholder="Confess your worst impulse. Lucifer is listening..."
          hint="Mock responses only — for entertainment, not actual life decisions. Enter to send, Shift+Enter for new line."
        />
      }
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          align={message.role === "lucifer" ? "start" : "end"}
          accent="ember"
          userAccent="terra"
          avatar={message.role === "lucifer" ? "🔥" : "😈"}
          label={message.role === "lucifer" ? "Lucifer" : undefined}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
      {isTyping && (
        <TypingIndicator
          accent="ember"
          label="Lucifer is scheming..."
          avatar="🔥"
        />
      )}
      <div ref={messagesEndRef} />
    </ChatShell>
  );
}
