"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Modal from "@/components/ui/Modal";

interface KeyboardShortcutsContextValue {
  helpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
}

const KeyboardShortcutsContext =
  createContext<KeyboardShortcutsContextValue | null>(null);

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const [helpOpen, setHelpOpen] = useState(false);

  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?" && !isTypingTarget(e.target)) {
        e.preventDefault();
        setHelpOpen(true);
        return;
      }

      if (e.key === "/" && !isTypingTarget(e.target)) {
        const search = document.querySelector<HTMLElement>(
          '[data-shortcut="search"]'
        );
        if (search) {
          e.preventDefault();
          search.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(
    () => ({ helpOpen, openHelp, closeHelp }),
    [helpOpen, openHelp, closeHelp]
  );

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <Modal open={helpOpen} onClose={closeHelp} title="Keyboard shortcuts">
        <h2 className="mb-4 pe-10 font-serif text-lg text-ink">Keyboard shortcuts</h2>
        <ul className="space-y-3 text-sm text-ink-soft">
          <li className="flex items-start justify-between gap-4">
            <span>Close dialogs and menus</span>
            <kbd className="verse-ref shrink-0 rounded border border-rule bg-smoke px-2 py-1 text-ink">
              Esc
            </kbd>
          </li>
          <li className="flex items-start justify-between gap-4">
            <span>Focus page search (when available)</span>
            <kbd className="verse-ref shrink-0 rounded border border-rule bg-smoke px-2 py-1 text-ink">
              /
            </kbd>
          </li>
          <li className="flex items-start justify-between gap-4">
            <span>Show this help</span>
            <kbd className="verse-ref shrink-0 rounded border border-rule bg-smoke px-2 py-1 text-ink">
              ?
            </kbd>
          </li>
          <li className="flex items-start justify-between gap-4">
            <span>Move between tabs</span>
            <kbd className="verse-ref shrink-0 rounded border border-rule bg-smoke px-2 py-1 text-ink">
              ← →
            </kbd>
          </li>
        </ul>
      </Modal>
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const ctx = useContext(KeyboardShortcutsContext);
  if (!ctx) {
    throw new Error("useKeyboardShortcuts must be used within KeyboardShortcutsProvider");
  }
  return ctx;
}
