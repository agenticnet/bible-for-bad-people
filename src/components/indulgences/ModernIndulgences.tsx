"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Crown,
  ShoppingBag,
  Trophy,
  Vault,
} from "lucide-react";
import LeaderboardPanel from "./LeaderboardPanel";
import CertificateCard from "./CertificateCard";
import PricingSection, { groupProductsByTier } from "./PricingSection";
import { INDULGENCE_PRODUCTS } from "@/lib/indulgenceProducts";
import type { PricedProduct } from "./PricingSection";
import { fetchSalvationProfile, fetchLeaderboardEntries } from "@/lib/data/indulgences";
import { fetchSinLog } from "@/lib/data/sin";
import type { LeaderboardEntry, UserSalvationProfile } from "@/lib/indulgenceTypes";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthGate from "@/components/auth/AuthGate";
import { DropTimer } from "@/components/collectibles";
import {
  ChamberHeader,
  EmptyState,
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

const pricedProducts: PricedProduct[] = INDULGENCE_PRODUCTS.map((p) => ({
  ...p,
  pricingTier: p.pricingTier ?? "everyday",
}));

const grouped = groupProductsByTier(pricedProducts);

export default function ModernIndulgences() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<IndulgenceTab>("shop");
  const [profile, setProfile] = useState<UserSalvationProfile | null>(null);
  const [sinCount, setSinCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setSinCount(0);
      const entries = await fetchLeaderboardEntries(null);
      setLeaderboard(entries);
      return;
    }

    const [p, sins, entries] = await Promise.all([
      fetchSalvationProfile(),
      fetchSinLog(),
      fetchLeaderboardEntries(user.id),
    ]);
    setProfile(p);
    setSinCount(sins.length);
    setLeaderboard(entries);
  }, [user]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const userRank = profile
    ? leaderboard.findIndex((e) => e.isUser) + 1 || null
    : null;

  const displayName = profile?.displayName ?? "";

  return (
    <PageShell maxWidth="lg">
      <ChamberHeader
        icon={Crown}
        accent="wine"
        title="Modern Indulgences"
        subtitle="Salvation as a Service™ · Mock payments only"
        badge="Stripe Never"
      />

      {user && profile && (
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
      )}

      <TabGroup
        className="mb-8"
        accent="wine"
        tabs={TABS}
        value={activeTab}
        onChange={(id) => setActiveTab(id as IndulgenceTab)}
      />

      {activeTab === "shop" && (
        <div>
          <PricingSection
            title="Premium Absolution (Anchor Pricing)"
            products={grouped.anchor}
            displayName={displayName}
            onPurchased={refreshProfile}
            variant="anchor"
          />
          <PricingSection
            title="Recommended for Most Sinners"
            products={grouped.recommended}
            displayName={displayName}
            onPurchased={refreshProfile}
            variant="recommended"
          />
          <div className="grid min-w-0 items-start gap-10 lg:grid-cols-[2fr_1fr]">
            <PricingSection
              title="Everyday Absolution"
              products={grouped.everyday}
              displayName={displayName}
              onPurchased={refreshProfile}
              variant="everyday"
              layout="wide"
            />
            <PricingSection
              title="Monthly Peace of Mind"
              description="Soul Insurance at $14.99/mo makes Indulgence+ at $9.99/mo feel like a steal."
              products={grouped.subscription}
              displayName={displayName}
              onPurchased={refreshProfile}
              variant="subscription"
            />
          </div>
          <DropTimer />
        </div>
      )}

      {activeTab === "leaderboard" && (
        <LeaderboardPanel entries={leaderboard} userRank={userRank} />
      )}

      {activeTab === "vault" && (
        <AuthGate
          mode="block"
          tone="wine"
          lossContext="indulgences"
          title="Sign in to view your vault"
        >
          <div>
            <h2 className="mb-1 font-serif text-xl font-bold text-ink">My Vault</h2>
            <p className="mb-6 text-sm text-ink-soft">
              Digital certificates of questionable absolution.
            </p>
            {!profile || profile.purchases.length === 0 ? (
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
        </AuthGate>
      )}
    </PageShell>
  );
}
