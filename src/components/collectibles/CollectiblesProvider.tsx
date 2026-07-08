"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  ProductInventoryRow,
  PurchaseActivityEvent,
  TimedDrop,
} from "@/lib/indulgenceTypes";
import {
  fetchActiveDrops,
  fetchCartPressure,
  fetchProductInventory,
  fetchRecentActivity,
  removeCartSession,
  upsertCartSession,
} from "@/lib/data/collectibles";
import { getCartSessionId } from "@/lib/collectibles/constants";
import { useServerTime } from "@/lib/collectibles/useServerTime";

interface CollectiblesContextValue {
  inventory: Record<string, ProductInventoryRow>;
  drops: Record<string, TimedDrop>;
  cartPressure: Record<string, number>;
  activityEvents: PurchaseActivityEvent[];
  serverOffsetMs: number;
  refreshInventory: () => Promise<void>;
  registerCartInterest: (productId: string) => () => void;
  pushActivityEvent: (event: PurchaseActivityEvent) => void;
}

const CollectiblesContext = createContext<CollectiblesContextValue | null>(null);

interface CollectiblesProviderProps {
  children: ReactNode;
  productIds?: string[];
}

export function CollectiblesProvider({
  children,
  productIds = [],
}: CollectiblesProviderProps) {
  const { offsetMs } = useServerTime();
  const [inventory, setInventory] = useState<Record<string, ProductInventoryRow>>({});
  const [drops, setDrops] = useState<Record<string, TimedDrop>>({});
  const [cartPressure, setCartPressure] = useState<Record<string, number>>({});
  const [activityEvents, setActivityEvents] = useState<PurchaseActivityEvent[]>([]);

  const refreshInventory = useCallback(async () => {
    const [inv, activeDrops, activity] = await Promise.all([
      fetchProductInventory(productIds.length ? productIds : undefined),
      fetchActiveDrops(),
      fetchRecentActivity(8),
    ]);

    setInventory(inv);
    setDrops(Object.fromEntries(activeDrops.map((d) => [d.productId, d])));
    setActivityEvents(activity);

    const pressureEntries = await Promise.all(
      Object.keys(inv).map(async (id) => [id, await fetchCartPressure(id)] as const)
    );
    setCartPressure(Object.fromEntries(pressureEntries));
  }, [productIds]);

  useEffect(() => {
    void refreshInventory();
    const interval = setInterval(() => void refreshInventory(), 15_000);
    return () => clearInterval(interval);
  }, [refreshInventory]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("collectibles-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_inventory" },
        () => void refreshInventory()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "purchase_activity_events" },
        (payload) => {
          const row = payload.new as {
            id: string;
            product_id: string;
            product_name: string;
            display_name: string;
            city: string | null;
            created_at: string;
          };
          setActivityEvents((prev) => [
            {
              id: row.id,
              productId: row.product_id,
              productName: row.product_name,
              displayName: row.display_name,
              city: row.city,
              createdAt: row.created_at,
            },
            ...prev.slice(0, 7),
          ]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refreshInventory]);

  const registerCartInterest = useCallback((productId: string) => {
    const sessionId = getCartSessionId();
    void upsertCartSession(productId, sessionId);
    void fetchCartPressure(productId).then((count) => {
      setCartPressure((prev) => ({ ...prev, [productId]: count }));
    });

    return () => {
      void removeCartSession(productId, sessionId);
    };
  }, []);

  const pushActivityEvent = useCallback((event: PurchaseActivityEvent) => {
    setActivityEvents((prev) => [event, ...prev.slice(0, 7)]);
  }, []);

  const value = useMemo(
    () => ({
      inventory,
      drops,
      cartPressure,
      activityEvents,
      serverOffsetMs: offsetMs,
      refreshInventory,
      registerCartInterest,
      pushActivityEvent,
    }),
    [
      inventory,
      drops,
      cartPressure,
      activityEvents,
      offsetMs,
      refreshInventory,
      registerCartInterest,
      pushActivityEvent,
    ]
  );

  return (
    <CollectiblesContext.Provider value={value}>
      {children}
    </CollectiblesContext.Provider>
  );
}

export function useCollectibles() {
  const ctx = useContext(CollectiblesContext);
  if (!ctx) {
    throw new Error("useCollectibles must be used within CollectiblesProvider");
  }
  return ctx;
}

export function useCollectiblesOptional() {
  return useContext(CollectiblesContext);
}
