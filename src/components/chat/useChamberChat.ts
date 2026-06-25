"use client";

import { useState, useRef, useEffect } from "react";
import type { ChamberChatConfig, ChamberMessage } from "@/lib/chatTypes";
import { fetchChatMessages, saveChatMessage } from "@/lib/data/chat-support";
import { useAuth } from "@/components/auth/AuthProvider";

export function useChamberChat(config: ChamberChatConfig) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChamberMessage[]>([config.initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: historyLoaded ? "smooth" : "instant",
    });
  }, [messages, isTyping, historyLoaded]);

  useEffect(() => {
    if (!user) {
      setMessages([config.initialMessage]);
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
    if (!trimmed || isTyping || !user) return;

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
  };
}
