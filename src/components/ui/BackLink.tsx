import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
      className="inline-flex items-center gap-2 rounded-sm border border-ivory/15 px-3 py-1.5 text-sm text-binding-muted transition-colors hover:border-ivory/30 hover:text-binding-ivory"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
