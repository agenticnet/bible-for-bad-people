"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Library,
  PlusCircle,
  ScrollText,
  ListChecks,
} from "lucide-react";
import type { SinTab } from "@/lib/sinTypes";
import DailySinChecklist from "./DailySinChecklist";
import SinTranslatorForm from "./SinTranslatorForm";
import SinLogPanel, { notifySinLogUpdate } from "./SinLogPanel";
import ContributeSinForm from "./ContributeSinForm";
import SinLibraryPanel from "./SinLibraryPanel";
import { SIN_LIBRARY } from "@/lib/sinLibrary";
import { ChamberHeader, PageShell, TabGroup } from "@/components/ui";

const TABS = [
  { id: "daily" as SinTab, label: "Daily Sins", icon: CalendarCheck },
  { id: "translate" as SinTab, label: "Translate", icon: ScrollText },
  { id: "log" as SinTab, label: "My Log", icon: ListChecks },
  { id: "contribute" as SinTab, label: "Contribute", icon: PlusCircle },
  { id: "library" as SinTab, label: "Library", icon: Library },
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
    <PageShell maxWidth="md">
      <ChamberHeader
        icon={ScrollText}
        accent="terra"
        title='"Sin" Translation Engine'
        subtitle={`Petty sins → King James drama · ${SIN_LIBRARY.length} sins in library`}
        badge="True prophecy pending"
      />

      <TabGroup
        className="mb-8"
        accent="terra"
        size="sm"
        tabs={TABS}
        value={activeTab}
        onChange={(id) => setActiveTab(id as SinTab)}
      />

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
    </PageShell>
  );
}
