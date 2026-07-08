import BindingBar from "./BindingBar";
import BackLink from "./BackLink";

interface PageShellProps {
  children: React.ReactNode;
  backHref?: string;
  showBack?: boolean;
  maxWidth?: "md" | "lg" | "xl" | "full";
  className?: string;
}

const maxWidthClass = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-full",
};

export default function PageShell({
  children,
  backHref = "/",
  showBack = true,
  maxWidth = "lg",
  className,
}: PageShellProps) {
  return (
    <div className="min-h-dvh bg-parchment">
      {showBack && (
        <BindingBar>
          <BackLink href={backHref} />
        </BindingBar>
      )}
      <div
        className={`mx-auto min-w-0 overflow-x-clip px-4 py-8 sm:px-6 sm:py-12 ${maxWidthClass[maxWidth]}${className ? ` ${className}` : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

interface ChatPageShellProps {
  children: React.ReactNode;
}

export function ChatPageShell({ children }: ChatPageShellProps) {
  return (
    <div className="flex h-dvh flex-col bg-parchment">
      <BindingBar className="flex items-center gap-3">
        <BackLink />
        <span className="text-xs text-binding-muted">Bible for Bad People</span>
      </BindingBar>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
