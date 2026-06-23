"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  ShoppingBag,
  Sparkles,
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
import { cn } from "@/lib/utils";

type IndulgenceTab = "shop" | "leaderboard" | "vault";

const TABS: { id: IndulgenceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "shop", label: "Marketplace", icon: ShoppingBag },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "vault", label: "My Vault", icon: Vault },
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

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-gold/40 bg-neon-gold/10">
              <Crown className="h-6 w-6 text-neon-gold" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-neon-gold sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Modern Indulgences
              </h1>
              <p className="text-sm text-ink-soft">
                Salvation as a Service™ · Mock payments only
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-neon-purple" />
              <span className="text-[10px] uppercase tracking-wider text-neon-purple">
                Stripe Never
              </span>
            </div>
          </div>
        </div>

        {/* Salvation score card */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neon-gold/30 bg-neon-gold/5 p-4 sm:col-span-1">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-neon-gold">
              Your Salvation Score
            </p>
            <p className="text-4xl font-bold text-neon-gold">
              {profile.salvationScore}
              <span className="text-lg text-ink-soft">/99</span>
            </p>
          </div>
          <div className="rounded-xl border border-rule bg-page p-4">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-soft">
              Sins Logged
            </p>
            <p className="text-2xl font-bold text-ink">{sinCount}</p>
            <p className="text-xs text-ink-soft">−2 each from Sin Engine</p>
          </div>
          <div className="rounded-xl border border-rule bg-page p-4">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-soft">
              Total Spent (Mock)
            </p>
            <p className="text-2xl font-bold text-ink">
              ${profile.totalSpent.toFixed(2)}
            </p>
            <p className="text-xs text-ink-soft">{profile.purchases.length} purchases</p>
          </div>
        </div>

        {/* Display name for leaderboard */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="display-name" className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">
              Leaderboard Display Name
            </label>
            <input
              id="display-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. ProbablyFineUser42"
              className="w-full rounded-lg border border-rule bg-page px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-neon-gold/50 focus:outline-none"
              maxLength={24}
            />
          </div>
          <button
            type="button"
            onClick={handleSaveName}
            disabled={!nameInput.trim()}
            className="rounded-lg border border-neon-gold/50 bg-neon-gold/10 px-5 py-2.5 text-sm font-semibold text-neon-gold hover:bg-neon-gold/20 disabled:opacity-40"
          >
            Save Name
          </button>
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
                className={cn( "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all", activeTab === tab.id ? "bg-neon-gold/15 text-neon-gold" : "text-ink-soft hover:text-ink" )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

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
            <div className="mb-6">
              <h2 className="text-xl font-bold text-ink">My Vault</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Digital certificates of questionable absolution.
              </p>
            </div>
            {profile.purchases.length === 0 ? (
              <div className="rounded-xl border border-dashed border-rule bg-page/80 px-6 py-16 text-center">
                <Vault className="mx-auto mb-4 h-10 w-10 text-ink-soft" />
                <p className="text-ink-soft">No indulgences purchased yet.</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Visit the marketplace to buy your way toward salvation.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {profile.purchases.map((purchase) => (
                  <CertificateCard key={purchase.id} purchase={purchase} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
