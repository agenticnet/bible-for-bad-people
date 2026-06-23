"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChatComposer,
  ChatHeader,
  ChatShell,
  MessageBubble,
  TypingIndicator,
} from "@/components/ui";
import type { Message } from "@/lib/chatTypes";
import { INITIAL_GOD_MESSAGE } from "@/lib/chatTypes";
import { getRandomGodResponse } from "@/lib/mockResponses";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GOD_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <ChatShell
      header={
        <ChatHeader
          accent="wine"
          avatar={<span className="text-xl">✝</span>}
          title="Speak with GOD"
          status="Online — Judging silently"
          badge="Visions Approximate"
          online
        />
      }
      composer={
        <ChatComposer
          accent="wine"
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          disabled={isTyping}
          placeholder="Confess, vent, or demand a miracle..."
          hint="Mock responses only — real divine API coming soon. Enter to send, Shift+Enter for new line."
        />
      }
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          align={message.role === "god" ? "start" : "end"}
          accent="wine"
          userAccent="plum"
          avatar={message.role === "god" ? "✝" : "😈"}
          label={message.role === "god" ? "GOD" : undefined}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
      {isTyping && (
        <TypingIndicator
          accent="wine"
          label="GOD is typing..."
          avatar="✝"
        />
      )}
      <div ref={messagesEndRef} />
    </ChatShell>
  );
}
