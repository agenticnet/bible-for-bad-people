import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { focusVisibleRingBinding } from "./tokens";

interface BackLinkProps {
  href?: string;
  label?: string;
}

export default function BackLink({
  href = "/",
  label = "Back to Home",
}: BackLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm border border-ivory/15 px-3 text-sm text-binding-muted transition-colors hover:border-ivory/30 hover:text-binding-ivory",
        TOUCH_TARGET_MIN,
        focusVisibleRingBinding
      )}
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
