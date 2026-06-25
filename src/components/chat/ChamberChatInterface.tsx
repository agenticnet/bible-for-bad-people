"use client";

import {
  ChatComposer,
  ChatHeader,
  ChatShell,
  MessageBubble,
  TypingIndicator,
} from "@/components/ui";
import type { ChamberChatConfig } from "@/lib/chatTypes";
import AuthGate from "@/components/auth/AuthGate";
import { useChamberChat } from "./useChamberChat";

interface ChamberChatInterfaceProps {
  config: ChamberChatConfig;
}

export default function ChamberChatInterface({ config }: ChamberChatInterfaceProps) {
  const {
    messages,
    input,
    setInput,
    isTyping,
    animatingId,
    sendMessage,
    messagesEndRef,
  } = useChamberChat(config);

  const userAccent = config.userAccent ?? "plum";

  return (
    <ChatShell
      header={
        <ChatHeader
          accent={config.accent}
          avatar={config.header.avatar}
          title={config.header.title}
          status={config.header.status}
          badge="Visions Approximate"
          online
        />
      }
      composer={
        <AuthGate
          tone={config.accent}
          title={config.authGate.title}
          description={config.authGate.description}
        >
          <ChatComposer
            accent={config.accent}
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            disabled={isTyping}
            placeholder={config.composer.placeholder}
            hint={config.composer.hint}
          />
        </AuthGate>
      }
    >
      {config.preamble}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          align={message.role === config.assistantRole ? "start" : "end"}
          accent={config.accent}
          userAccent={userAccent}
          avatar={
            message.role === config.assistantRole
              ? config.bubbles.assistantAvatar
              : config.bubbles.userAvatar
          }
          label={
            message.role === config.assistantRole
              ? config.bubbles.assistantLabel
              : undefined
          }
          content={message.content}
          timestamp={message.timestamp}
          animate={message.id === animatingId}
        />
      ))}
      {isTyping && (
        <TypingIndicator
          accent={config.accent}
          label={config.bubbles.typingLabel}
          avatar={config.bubbles.assistantAvatar}
        />
      )}
      <div ref={messagesEndRef} />
    </ChatShell>
  );
}
