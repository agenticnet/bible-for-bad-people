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
import { fetchChatMessages, saveChatMessage } from "@/lib/data/chat-support";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthGate from "@/components/auth/AuthGate";

export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([INITIAL_GOD_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!user) {
      setMessages([INITIAL_GOD_MESSAGE]);
      return;
    }
    void fetchChatMessages("god").then((stored) => {
      setMessages(stored.length > 0 ? stored : [INITIAL_GOD_MESSAGE]);
    });
  }, [user]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping || !user) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    await saveChatMessage("god", { role: "user", content: trimmed });

    setTimeout(async () => {
      const response = getRandomGodResponse();
      const godMessage: Message = {
        id: `god-${Date.now()}`,
        role: "god",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, godMessage]);
      await saveChatMessage("god", { role: "god", content: response });
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
        <AuthGate
          tone="wine"
          title="Sign in to speak with GOD"
          description="Read the divine welcome message for free. Log in to vent, confess, and save your chat history."
        >
          <ChatComposer
            accent="wine"
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            disabled={isTyping}
            placeholder="Confess, vent, or demand a miracle..."
            hint="Mock responses only. Enter to send, Shift+Enter for new line."
          />
        </AuthGate>
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
