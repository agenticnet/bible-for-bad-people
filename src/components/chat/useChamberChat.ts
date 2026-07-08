"use client";

import { useState, useRef, useEffect } from "react";
import type { ChamberChatConfig, ChamberMessage } from "@/lib/chatTypes";
import { fetchChatMessages, saveChatMessage } from "@/lib/data/chat-support";
import { useAuth } from "@/components/auth/AuthProvider";
import { markChatPreviewUsed } from "@/lib/auth/localDataSummary";

const PREVIEW_MESSAGE_KEY = "bfb-chat-preview-messages";

function loadPreviewMessages(channel: string): ChamberMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PREVIEW_MESSAGE_KEY}-${channel}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Array<Omit<ChamberMessage, "timestamp"> & { timestamp: string }>;
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return null;
  }
}

function savePreviewMessages(channel: string, messages: ChamberMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PREVIEW_MESSAGE_KEY}-${channel}`, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

export function useChamberChat(config: ChamberChatConfig) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChamberMessage[]>([config.initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [previewExhausted, setPreviewExhausted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: historyLoaded ? "smooth" : "instant",
    });
  }, [messages, isTyping, historyLoaded]);

  useEffect(() => {
    if (!user) {
      const preview = loadPreviewMessages(config.channel);
      setMessages(preview && preview.length > 0 ? preview : [config.initialMessage]);
      setPreviewExhausted(
        preview ? preview.filter((m) => m.role === "user").length >= 1 : false
      );
      setHistoryLoaded(true);
      return;
    }
    setHistoryLoaded(false);
    void fetchChatMessages(config.channel).then((stored) => {
      const mapped = config.mapStoredMessage
        ? stored.map(config.mapStoredMessage)
        : stored;
      setMessages(mapped.length > 0 ? mapped : [config.initialMessage]);
      setHistoryLoaded(true);
    });
  }, [user, config.channel, config.initialMessage, config.mapStoredMessage]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    if (!user) {
      if (previewExhausted) return;

      const userMessage: ChamberMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const next = [...prev, userMessage];
        savePreviewMessages(config.channel, next);
        return next;
      });
      setAnimatingId(userMessage.id);
      setInput("");
      setIsTyping(true);
      markChatPreviewUsed();

      setTimeout(() => {
        const response = config.getMockResponse();
        const assistantMessage: ChamberMessage = {
          id: `${config.assistantRole}-${Date.now()}`,
          role: config.assistantRole,
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => {
          const next = [...prev, assistantMessage];
          savePreviewMessages(config.channel, next);
          return next;
        });
        setAnimatingId(assistantMessage.id);
        setIsTyping(false);
        setPreviewExhausted(true);
      }, 1000);
      return;
    }

    const userMessage: ChamberMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setAnimatingId(userMessage.id);
    setInput("");
    setIsTyping(true);

    await saveChatMessage(config.channel, { role: "user", content: trimmed });

    setTimeout(async () => {
      const response = config.getMockResponse();
      const assistantMessage: ChamberMessage = {
        id: `${config.assistantRole}-${Date.now()}`,
        role: config.assistantRole,
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setAnimatingId(assistantMessage.id);
      await saveChatMessage(config.channel, {
        role: config.assistantRole,
        content: response,
      });
      setIsTyping(false);
    }, 1000);
  }

  return {
    messages,
    input,
    setInput,
    isTyping,
    animatingId,
    sendMessage,
    messagesEndRef,
    previewExhausted,
    isAnonymous: !user,
  };
}
