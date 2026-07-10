import type { Metadata } from "next";
import { Figtree, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { OnboardingDraftProvider } from "@/components/auth/OnboardingDraftProvider";
import AuthModalRoot from "@/components/auth/AuthModalRoot";
import { MotionProvider } from "@/components/MotionProvider";
import CollectiblesRoot from "@/components/collectibles/CollectiblesRoot";
import { KeyboardShortcutsProvider } from "@/components/ui/KeyboardShortcutsProvider";
import "./globals.css";

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const fontSans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bible for Bad People",
  description:
    "Vent to the divine. Skip the piety. A provocative AI-driven sanctuary for the spiritually exhausted and morally flexible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-wine focus:px-4 focus:py-3 focus:text-sm focus:text-ivory"
        >
          Skip to content
        </a>
        <AuthProvider>
          <AuthModalProvider>
            <OnboardingDraftProvider>
              <MotionProvider>
                <KeyboardShortcutsProvider>
                  <CollectiblesRoot>
                    {children}
                    <AuthModalRoot />
                  </CollectiblesRoot>
                </KeyboardShortcutsProvider>
              </MotionProvider>
            </OnboardingDraftProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
