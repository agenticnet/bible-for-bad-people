"use client";

import BottomSheet from "./BottomSheet";
import Modal from "./Modal";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Accent } from "./tokens";

interface ResponsiveOverlayProps {
  open: boolean;
  onClose: () => void;
  accent?: Accent;
  title?: string;
  children: React.ReactNode;
  className?: string;
  closeDisabled?: boolean;
  /** Mobile bottom sheet snap height */
  snapHeight?: string;
}

export default function ResponsiveOverlay({
  open,
  onClose,
  accent = "wine",
  title,
  children,
  className,
  closeDisabled = false,
  snapHeight,
}: ResponsiveOverlayProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <BottomSheet
        open={open}
        onClose={onClose}
        accent={accent}
        title={title}
        className={className}
        closeDisabled={closeDisabled}
        snapHeight={snapHeight}
      >
        {children}
      </BottomSheet>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      accent={accent}
      title={title}
      className={className}
      closeDisabled={closeDisabled}
    >
      {children}
    </Modal>
  );
}
