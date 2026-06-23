import { FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";
import IconButton from "./IconButton";
import { Textarea } from "./Input";
import VisionsBadge from "./VisionsBadge";

interface ChatComposerProps {
  accent: Accent;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
}

export default function ChatComposer({
  accent,
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type a message...",
  hint,
}: ChatComposerProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (disabled || !value.trim()) return;
    onSubmit(value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (disabled || !value.trim()) return;
      onSubmit(value);
    }
  }

  return (
    <div className="border-t border-rule bg-page px-4 py-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-end gap-3"
      >
        <Textarea
          accent={accent}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="min-h-12 max-h-[120px] rounded-xl py-3 sm:text-base"
        />
        <IconButton
          type="submit"
          accent={accent}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </IconButton>
      </form>
      {hint && (
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}

interface ChatShellProps {
  header: React.ReactNode;
  banner?: React.ReactNode;
  children: React.ReactNode;
  composer: React.ReactNode;
}

export function ChatShell({ header, banner, children, composer }: ChatShellProps) {
  return (
    <div className="flex h-full flex-col">
      {header}
      {banner}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">{children}</div>
      </div>
      {composer}
    </div>
  );
}

interface ChatHeaderProps {
  accent: Accent;
  avatar: React.ReactNode;
  title: string;
  status: string;
  badge?: string;
  online?: boolean;
}

export function ChatHeader({
  accent,
  avatar,
  title,
  status,
  badge,
  online,
}: ChatHeaderProps) {
  return (
    <div className="border-b border-rule bg-page px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border-2",
              accentStyles[accent].borderMuted,
              accentStyles[accent].bgMuted,
              accentStyles[accent].text
            )}
          >
            {avatar}
          </div>
          {online !== undefined && (
            <span
              className={cn(
                "absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-parchment",
                online ? "bg-green-500" : "bg-ember"
              )}
            />
          )}
        </div>
        <div>
          <h1 className={cn("font-serif text-lg font-bold", accentStyles[accent].text)}>
            {title}
          </h1>
          <p className="text-xs text-ink-soft">{status}</p>
        </div>
        {badge && (
          <VisionsBadge
            label={badge}
            accent={accent}
            className="ml-auto hidden sm:block"
          />
        )}
      </div>
    </div>
  );
}
