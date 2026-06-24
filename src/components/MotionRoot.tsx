"use client";

import { PageTransition } from "@/components/ui";

interface MotionRootProps {
  children: React.ReactNode;
}

export default function MotionRoot({ children }: MotionRootProps) {
  return <PageTransition>{children}</PageTransition>;
}
