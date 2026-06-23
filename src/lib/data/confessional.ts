"use server";

import { createClient } from "@/lib/supabase/server";
import type { Confession, VoteType } from "@/lib/confessionalTypes";
import { SEED_CONFESSIONS } from "@/lib/confessionalPosts";

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchConfessions(): Promise<Confession[]> {
  const supabase = await createClient();
  const userId = await getCurrentUserId();

  const { data: rows, error } = await supabase
    .from("confessions")
    .select("id, content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchConfessions:", error.message);
    return [...SEED_CONFESSIONS];
  }

  const userIds = [...new Set((rows ?? []).map((r) => r.user_id))];
  const usernameById: Record<string, string> = {};

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);

    for (const profile of profiles ?? []) {
      usernameById[profile.id] = profile.username;
    }
  }

  const confessionIds = (rows ?? []).map((r) => r.id);
  const voteCounts: Record<string, { absolve: number; condemn: number }> = {};

  if (confessionIds.length > 0) {
    const { data: votes } = await supabase
      .from("confession_votes")
      .select("confession_id, vote")
      .in("confession_id", confessionIds);

    for (const v of votes ?? []) {
      if (!voteCounts[v.confession_id]) {
        voteCounts[v.confession_id] = { absolve: 0, condemn: 0 };
      }
      if (v.vote === "absolve") voteCounts[v.confession_id].absolve++;
      else voteCounts[v.confession_id].condemn++;
    }
  }

  const dbConfessions: Confession[] = (rows ?? []).map((row) => {
    const counts = voteCounts[row.id] ?? { absolve: 0, condemn: 0 };
    return {
      id: row.id,
      content: row.content,
      absolveVotes: counts.absolve,
      condemnVotes: counts.condemn,
      createdAt: row.created_at,
      authorLabel: usernameById[row.user_id] ?? "unknown",
      isUser: userId === row.user_id,
    };
  });

  return [...dbConfessions, ...SEED_CONFESSIONS];
}

export async function fetchUserVotes(): Promise<Record<string, VoteType>> {
  const supabase = await createClient();
  const userId = await getCurrentUserId();
  if (!userId) return {};

  const { data, error } = await supabase
    .from("confession_votes")
    .select("confession_id, vote")
    .eq("user_id", userId);

  if (error) return {};

  const votes: Record<string, VoteType> = {};
  for (const row of data ?? []) {
    votes[row.confession_id] = row.vote;
  }
  return votes;
}

export async function submitConfession(
  content: string
): Promise<{ confession?: Confession; error?: string }> {
  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 500) {
    return { error: "Confession must be 1–500 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to confess." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return { error: "Complete username setup before posting." };
  }

  const { data, error } = await supabase
    .from("confessions")
    .insert({ user_id: user.id, content: trimmed })
    .select("id, content, created_at")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Failed to post confession." };
  }

  return {
    confession: {
      id: data.id,
      content: data.content,
      absolveVotes: 0,
      condemnVotes: 0,
      createdAt: data.created_at,
      authorLabel: profile.username,
      isUser: true,
    },
  };
}

export async function castConfessionVote(
  confessionId: string,
  vote: VoteType
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to vote." };
  }

  const { data: existing } = await supabase
    .from("confession_votes")
    .select("id, vote")
    .eq("confession_id", confessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.vote === vote) {
    await supabase.from("confession_votes").delete().eq("id", existing.id);
    return {};
  }

  if (existing) {
    const { error } = await supabase
      .from("confession_votes")
      .update({ vote })
      .eq("id", existing.id);
    if (error) return { error: error.message };
    return {};
  }

  const { error } = await supabase.from("confession_votes").insert({
    confession_id: confessionId,
    user_id: user.id,
    vote,
  });

  if (error) return { error: error.message };
  return {};
}
