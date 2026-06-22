import { Cross } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ash/50 bg-abyss">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Cross className="h-4 w-4 rotate-45 text-neon-purple/60" />
            <span className="text-sm text-muted">
              Bible for Bad People &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="max-w-md text-center text-xs text-muted/70 sm:text-right">
            Not affiliated with any deity, denomination, or eternal damnation service.
            For entertainment purposes only. Your soul is your own problem.
          </p>
        </div>
      </div>
    </footer>
  );
}
