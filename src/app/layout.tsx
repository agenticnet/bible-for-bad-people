import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen">
        <div className="pointer-events-none fixed inset-0 noise-overlay" />
        {children}
      </body>
    </html>
  );
}
