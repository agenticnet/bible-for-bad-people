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
import { fetchChatMessages, saveChatMessage } from "@/lib/data/chat-support";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthGate from "@/components/auth/AuthGate";

export default function LuciferChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<LuciferMessage[]>([INITIAL_LUCIFER_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!user) {
      setMessages([INITIAL_LUCIFER_MESSAGE]);
      return;
    }
    void fetchChatMessages("lucifer").then((stored) => {
      const mapped: LuciferMessage[] = stored.map((m) => ({
        id: m.id,
        role: m.role === "user" ? "user" : "lucifer",
        content: m.content,
        timestamp: m.timestamp,
      }));
      setMessages(mapped.length > 0 ? mapped : [INITIAL_LUCIFER_MESSAGE]);
    });
  }, [user]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping || !user) return;

    const userMessage: LuciferMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    await saveChatMessage("lucifer", { role: "user", content: trimmed });

    setTimeout(async () => {
      const response = getRandomLuciferResponse();
      const luciferMessage: LuciferMessage = {
        id: `lucifer-${Date.now()}`,
        role: "lucifer",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, luciferMessage]);
      await saveChatMessage("lucifer", { role: "lucifer", content: response });
      setIsTyping(false);
    }, 1000);
  }

  return (
    <ChatShell
      header={
        <ChatHeader
          accent="ember"
          avatar={<Flame className="h-5 w-5" />}
          title="Devil's Advocate Mode"
          status="Online — Enabling poor choices"
          badge="Visions Approximate"
          online
        />
      }
      composer={
        <AuthGate
          tone="ember"
          title="Sign in to chat with Lucifer"
          description="Read his pitch for free. Log in to get terrible advice and save the transcript."
        >
          <ChatComposer
            accent="ember"
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            disabled={isTyping}
            placeholder="What's the worst idea you're considering?"
            hint="Mock responses only. Enter to send."
          />
        </AuthGate>
      }
    >
      <Callout tone="ember" className="mb-4 text-sm">
        Lucifer is not a licensed attorney, therapist, or moral compass. Proceed
        accordingly.
      </Callout>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          align={message.role === "lucifer" ? "start" : "end"}
          accent="ember"
          userAccent="plum"
          avatar={message.role === "lucifer" ? "😈" : "🙂"}
          label={message.role === "lucifer" ? "LUCIFER" : undefined}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
      {isTyping && (
        <TypingIndicator
          accent="ember"
          label="Lucifer is typing..."
          avatar="😈"
        />
      )}
      <div ref={messagesEndRef} />
    </ChatShell>
  );
}
