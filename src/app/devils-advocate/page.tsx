import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LuciferChatInterface from "@/components/devils-advocate/LuciferChatInterface";

export default function DevilsAdvocatePage() {
  return (
    <div className="flex h-dvh flex-col bg-void">
      <div className="flex items-center gap-3 border-b border-ash/50 bg-void/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-ash px-3 py-1.5 text-sm text-muted transition-colors hover:border-neon-red/50 hover:text-bone"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <span className="text-xs text-muted/50">Bible for Bad People</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <LuciferChatInterface />
      </div>
    </div>
  );
}
