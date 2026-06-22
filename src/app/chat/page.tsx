import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div className="flex h-dvh flex-col bg-void">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-ash/50 bg-void/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-ash px-3 py-1.5 text-sm text-muted transition-colors hover:border-neon-purple/50 hover:text-bone"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <span className="text-xs text-muted/50">
          Bible for Bad People
        </span>
      </div>

      {/* Chat fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
