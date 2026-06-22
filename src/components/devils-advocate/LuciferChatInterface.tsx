"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import { Flame, Send, Sparkles } from "lucide-react";
import LuciferMessageBubble from "./LuciferMessageBubble";
import LuciferTypingIndicator from "./LuciferTypingIndicator";
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-ash/50 bg-shadow/80 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-neon-red/50 bg-neon-red/10">
              <Flame className="h-6 w-6 text-neon-red" />
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-shadow bg-neon-red animate-pulse-glow" />
          </div>
          <div>
            <h1
              className="text-lg font-bold text-neon-red"
              style={{
                fontFamily: "var(--font-display)",
                textShadow:
                  "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.2)",
              }}
            >
              Devil&apos;s Advocate Mode
            </h1>
            <p className="text-xs text-muted">
              Lucifer — Online &amp; enabling poor choices
            </p>
          </div>
          <div className="ml-auto hidden items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-3 py-1 sm:flex">
            <Sparkles className="h-3 w-3 text-neon-purple" />
            <span className="text-[10px] uppercase tracking-wider text-neon-purple">
              Mock Mode
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="border-b border-neon-red/10 bg-neon-red/5 px-4 py-2 sm:px-6">
        <p className="mx-auto max-w-3xl text-center text-[11px] text-neon-red/70">
          GOD is currently unavailable. You are now chatting with the competition.
          Lucifer does not offer salvation, refunds, or good advice.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.map((message) => (
            <LuciferMessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <LuciferTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-ash/50 bg-abyss/90 px-4 py-4 backdrop-blur-sm sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Confess your worst impulse. Lucifer is listening..."
            rows={1}
            disabled={isTyping}
            className="w-full resize-none rounded-xl border border-ash bg-shadow px-4 py-3 text-sm text-bone placeholder:text-muted/50 focus:border-neon-red/50 focus:outline-none focus:ring-1 focus:ring-neon-red/30 disabled:opacity-50 sm:text-base"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon-red/50 bg-neon-red/15 text-neon-red transition-all hover:border-neon-red hover:bg-neon-red/25 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-muted/40">
          Mock responses only — for entertainment, not actual life decisions.
          Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
