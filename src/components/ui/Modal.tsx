"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, surfaceBase, type Accent } from "./tokens";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  accent?: Accent;
  title?: string;
  children: React.ReactNode;
  className?: string;
  closeDisabled?: boolean;
}

export default function Modal({
  open,
  onClose,
  accent = "wine",
  title,
  children,
  className,
  closeDisabled = false,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment/80 p-4">
      <div
        className={cn(
          surfaceBase,
          "relative w-full max-w-md p-6",
          accentStyles[accent].borderMuted,
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={closeDisabled}
          className="absolute top-4 right-4 text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
