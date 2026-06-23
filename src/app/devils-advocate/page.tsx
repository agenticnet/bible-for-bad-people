import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LuciferChatInterface from "@/components/devils-advocate/LuciferChatInterface";

export default function DevilsAdvocatePage() {
  return (
    <div className="flex h-dvh flex-col bg-parchment">
      <div className="flex items-center gap-3 border-b border-ivory/10 bg-binding px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-sm border border-ivory/15 px-3 py-1.5 text-sm text-binding-muted transition-colors hover:border-ivory/30 hover:text-binding-ivory"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <span className="text-xs text-binding-muted">Bible for Bad People</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <LuciferChatInterface />
      </div>
    </div>
  );
}
