import { BackLink, BindingBar } from "@/components/ui";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div className="flex h-dvh flex-col bg-parchment">
      <BindingBar className="flex items-center gap-3">
        <BackLink />
        <span className="text-xs text-binding-muted">Bible for Bad People</span>
      </BindingBar>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
