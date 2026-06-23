"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  Library,
  PlusCircle,
  ScrollText,
  Sparkles,
  ListChecks,
} from "lucide-react";
import type { SinTab } from "@/lib/sinTypes";
import DailySinChecklist from "./DailySinChecklist";
import SinTranslatorForm from "./SinTranslatorForm";
import SinLogPanel, { notifySinLogUpdate } from "./SinLogPanel";
import ContributeSinForm from "./ContributeSinForm";
import SinLibraryPanel from "./SinLibraryPanel";
import { SIN_LIBRARY } from "@/lib/sinLibrary";
import { cn } from "@/lib/utils";

const TABS: { id: SinTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "daily", label: "Daily Sins", icon: CalendarCheck },
  { id: "translate", label: "Translate", icon: ScrollText },
  { id: "log", label: "My Log", icon: ListChecks },
  { id: "contribute", label: "Contribute", icon: PlusCircle },
  { id: "library", label: "Library", icon: Library },
];

export default function SinTranslationApp() {
  const [activeTab, setActiveTab] = useState<SinTab>("daily");
  const [communityRefresh, setCommunityRefresh] = useState(0);

  function handleLogUpdate() {
    notifySinLogUpdate();
  }

  function handleContributed() {
    setCommunityRefresh((k) => k + 1);
  }

  return (
    <div className="min-h-dvh bg-parchment">
      <div className="border-b border-ivory/10 bg-binding px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-sm border border-ivory/15 px-3 py-1.5 text-sm text-binding-muted transition-colors hover:border-ivory/30 hover:text-binding-ivory"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-pink/40 bg-neon-pink/10">
              <ScrollText className="h-6 w-6 text-neon-pink" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-neon-pink sm:text-3xl"
                style={{
                  fontFamily: "var(--font-display)",
                  textShadow: "0 0 20px rgba(244, 114, 182, 0.4)",
                }}
              >
                &ldquo;Sin&rdquo; Translation Engine
              </h1>
              <p className="text-sm text-ink-soft">
                Petty sins → King James drama · {SIN_LIBRARY.length} sins in library
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-neon-purple" />
              <span className="text-[10px] uppercase tracking-wider text-neon-purple">
                True prophecy pending
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-rule bg-page p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn( "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm", activeTab === tab.id ? "bg-neon-pink/15 text-neon-pink" : "text-ink-soft hover:text-ink" )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        {activeTab === "daily" && (
          <DailySinChecklist onLogUpdate={handleLogUpdate} />
        )}
        {activeTab === "translate" && (
          <SinTranslatorForm onLogUpdate={handleLogUpdate} />
        )}
        {activeTab === "log" && <SinLogPanel />}
        {activeTab === "contribute" && (
          <ContributeSinForm onContributed={handleContributed} />
        )}
        {activeTab === "library" && (
          <SinLibraryPanel refreshKey={communityRefresh} />
        )}
      </div>
    </div>
  );
}
