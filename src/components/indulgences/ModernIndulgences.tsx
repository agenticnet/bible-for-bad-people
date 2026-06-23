"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Crown,
  ShoppingBag,
  Trophy,
  Vault,
} from "lucide-react";
import ProductCard from "./ProductCard";
import LeaderboardPanel from "./LeaderboardPanel";
import CertificateCard from "./CertificateCard";
import { INDULGENCE_PRODUCTS, buildLeaderboard } from "@/lib/indulgenceProducts";
import {
  loadProfile,
  computeSalvationScore,
  updateDisplayName,
} from "@/lib/indulgenceStorage";
import { loadSinLog } from "@/lib/sinStorage";
import type { UserSalvationProfile } from "@/lib/indulgenceTypes";
import {
  Button,
  ChamberHeader,
  EmptyState,
  Input,
  Label,
  MetricCard,
  PageShell,
  TabGroup,
} from "@/components/ui";

type IndulgenceTab = "shop" | "leaderboard" | "vault";

const TABS = [
  { id: "shop" as IndulgenceTab, label: "Marketplace", icon: ShoppingBag },
  { id: "leaderboard" as IndulgenceTab, label: "Leaderboard", icon: Trophy },
  { id: "vault" as IndulgenceTab, label: "My Vault", icon: Vault },
];

export default function ModernIndulgences() {
  const [activeTab, setActiveTab] = useState<IndulgenceTab>("shop");
  const [profile, setProfile] = useState<UserSalvationProfile | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [mounted, setMounted] = useState(false);

  const refreshProfile = useCallback(() => {
    const p = loadProfile();
    p.salvationScore = computeSalvationScore(p);
    setProfile(p);
    setNameInput(p.displayName);
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshProfile();
  }, [refreshProfile]);

  function handleSaveName() {
    if (!nameInput.trim()) return;
    const updated = updateDisplayName(nameInput.trim());
    setProfile(updated);
  }

  if (!mounted || !profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-parchment">
        <p className="text-ink-soft">Opening the treasury...</p>
      </div>
    );
  }

  const sinCount = loadSinLog().length;
  const leaderboard = buildLeaderboard(
    profile.displayName || null,
    profile.salvationScore
  );
  const userRank = profile.displayName
    ? leaderboard.findIndex((e) => e.isUser) + 1
    : null;

  return (
    <PageShell maxWidth="lg">
      <ChamberHeader
        icon={Crown}
        accent="wine"
        title="Modern Indulgences"
        subtitle="Salvation as a Service™ · Mock payments only"
        badge="Stripe Never"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <MetricCard
          accent="wine"
          accentTint
          label="Your Salvation Score"
          value={
            <>
              {profile.salvationScore}
              <span className="text-lg text-ink-soft">/99</span>
            </>
          }
        />
        <MetricCard
          label="Sins Logged"
          value={sinCount}
          hint="−2 each from Sin Engine"
        />
        <MetricCard
          label="Total Spent (Mock)"
          value={`$${profile.totalSpent.toFixed(2)}`}
          hint={`${profile.purchases.length} purchases`}
        />
      </div>

      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="display-name">Leaderboard Display Name</Label>
          <Input
            id="display-name"
            accent="wine"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="e.g. ProbablyFineUser42"
            maxLength={24}
          />
        </div>
        <Button accent="wine" onClick={handleSaveName} disabled={!nameInput.trim()}>
          Save Name
        </Button>
      </div>

      <TabGroup
        className="mb-8"
        accent="wine"
        tabs={TABS}
        value={activeTab}
        onChange={(id) => setActiveTab(id as IndulgenceTab)}
      />

      {activeTab === "shop" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {INDULGENCE_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              displayName={profile.displayName}
              onPurchased={refreshProfile}
            />
          ))}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <LeaderboardPanel entries={leaderboard} userRank={userRank} />
      )}

      {activeTab === "vault" && (
        <div>
          <h2 className="mb-1 font-serif text-xl font-bold text-ink">My Vault</h2>
          <p className="mb-6 text-sm text-ink-soft">
            Digital certificates of questionable absolution.
          </p>
          {profile.purchases.length === 0 ? (
            <EmptyState
              icon={Vault}
              title="No indulgences purchased yet."
              description="Visit the marketplace to buy your way toward salvation."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {profile.purchases.map((purchase) => (
                <CertificateCard key={purchase.id} purchase={purchase} />
              ))}
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
