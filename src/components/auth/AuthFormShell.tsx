import { BindingBar, BackLink, Surface } from "@/components/ui";

interface AuthFormShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthFormShell({ title, subtitle, children }: AuthFormShellProps) {
  return (
    <div className="min-h-dvh bg-parchment">
      <BindingBar>
        <BackLink href="/" label="Back to Home" />
      </BindingBar>
      <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
        </header>
        <Surface accent="wine" accentTint>
          {children}
        </Surface>
      </div>
    </div>
  );
}
