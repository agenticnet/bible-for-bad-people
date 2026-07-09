import Header from "@/components/Header";
import { HEADER_OFFSET, VIEWPORT_BELOW_HEADER } from "@/lib/ux/constraints";
import { cn } from "@/lib/utils";
import BindingBar from "./BindingBar";
import BackLink from "./BackLink";

interface PageShellProps {
  children: React.ReactNode;
  backHref?: string;
  showBack?: boolean;
  showSiteNav?: boolean;
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
  showSiteNav = true,
  maxWidth = "lg",
  className,
}: PageShellProps) {
  return (
    <>
      {showSiteNav && <Header />}
      <div
        className={cn(
          "min-h-dvh bg-parchment",
          showSiteNav && HEADER_OFFSET,
          className
        )}
      >
        {showBack && (
          <BindingBar>
            <BackLink href={backHref} />
          </BindingBar>
        )}
        <div
          className={`mx-auto min-w-0 overflow-x-clip px-4 py-8 sm:px-6 sm:py-12 ${maxWidthClass[maxWidth]}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

interface ChatPageShellProps {
  children: React.ReactNode;
  showSiteNav?: boolean;
}

export function ChatPageShell({ children, showSiteNav = true }: ChatPageShellProps) {
  return (
    <>
      {showSiteNav && <Header />}
      <div
        className={cn(
          "flex flex-col bg-parchment",
          showSiteNav ? VIEWPORT_BELOW_HEADER : "h-dvh"
        )}
      >
        <BindingBar className="flex shrink-0 items-center gap-3">
          <BackLink />
          <span className="text-xs text-binding-muted">Bible for Bad People</span>
        </BindingBar>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </>
  );
}
