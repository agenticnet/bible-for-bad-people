import BindingBar from "./BindingBar";
import BackLink from "./BackLink";
import ChamberBindingBar from "./ChamberBindingBar";

interface PageShellProps {
  children: React.ReactNode;
  backHref?: string;
  showBack?: boolean;
  showChamberNav?: boolean;
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
  showChamberNav = true,
  maxWidth = "lg",
  className,
}: PageShellProps) {
  return (
    <div className={`min-h-dvh bg-parchment${className ? ` ${className}` : ""}`}>
      {showBack &&
        (showChamberNav ? (
          <ChamberBindingBar backHref={backHref} />
        ) : (
          <BindingBar>
            <BackLink href={backHref} />
          </BindingBar>
        ))}
      <main
        id="main-content"
        className={`mx-auto min-w-0 overflow-x-clip px-4 py-8 sm:px-6 sm:py-12 ${maxWidthClass[maxWidth]}`}
      >
        {children}
      </main>
    </div>
  );
}

interface ChatPageShellProps {
  children: React.ReactNode;
}

export function ChatPageShell({ children }: ChatPageShellProps) {
  return (
    <div className="flex h-dvh flex-col bg-parchment">
      <ChamberBindingBar />
      <main id="main-content" className="min-h-0 flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
