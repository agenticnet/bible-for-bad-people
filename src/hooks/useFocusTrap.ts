"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap focus inside `containerRef` while `active` is true.
 * Restores focus to the previously focused element on cleanup.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>
) {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const container = containerRef.current;
    if (!container) return;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );

    // Initial focus: first focusable, or container
    const initial = focusables()[0] ?? container;
    initial.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !containerRef.current) return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        containerRef.current.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus();
    };
  }, [active, containerRef]);
}
