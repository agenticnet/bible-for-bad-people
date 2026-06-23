"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import { Send, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import type { Message } from "@/lib/chatTypes";
import { INITIAL_GOD_MESSAGE } from "@/lib/chatTypes";
import { getRandomGodResponse } from "@/lib/mockResponses";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GOD_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const godMessage: Message = {
        id: `god-${Date.now()}`,
        role: "god",
        content: getRandomGodResponse(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, godMessage]);
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
      {/* Chat header */}
      <div className="border-b border-rule bg-page px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-neon-gold/50 bg-neon-gold/10">
              <span className="text-xl" aria-hidden="true">
                ✝
              </span>
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-parchment bg-green-500" />
          </div>
          <div>
            <h1
              className="text-lg font-bold text-neon-gold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Speak with GOD
            </h1>
            <p className="text-xs text-ink-soft">
              Online — Judging silently
            </p>
          </div>
          <div className="ml-auto hidden items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-3 py-1 sm:flex">
            <Sparkles className="h-3 w-3 text-neon-purple" />
            <span className="text-[10px] uppercase tracking-wider text-neon-purple">
              Visions Approximate
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-rule bg-page px-4 py-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Confess, vent, or demand a miracle..."
              rows={1}
              disabled={isTyping}
              className="w-full resize-none rounded-xl border border-rule bg-page px-4 py-3 pr-4 text-sm text-ink placeholder:text-ink-soft focus:border-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-neon-purple/30 disabled:opacity-50 sm:text-base"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon-gold/50 bg-neon-gold/15 text-neon-gold transition-all hover:border-neon-gold hover:bg-neon-gold/25 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-ink-soft">
          Mock responses only — real divine API coming soon. Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
