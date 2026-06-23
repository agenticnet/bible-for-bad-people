import { notFound } from "next/navigation";
import Link from "next/link";
import { getProfileByUsername } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetricCard, PageShell, Surface } from "@/components/ui";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const data = await getProfileByUsername(username);

  if (!data) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === data.profile.id;
  const memberSince = new Date(data.profile.created_at).toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header />
      <PageShell maxWidth="md" showBack>
        <header className="mb-8">
          <p className="verse-ref mb-1 text-wine">u/{data.profile.username}</p>
          <h1 className="font-serif text-3xl font-bold text-ink">
            {data.profile.username}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">Member since {memberSince}</p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <MetricCard
            accent="wine"
            accentTint
            label="Salvation Score"
            value={
              <>
                {data.profile.salvation_score}
                <span className="text-lg text-ink-soft">/99</span>
              </>
            }
          />
          <MetricCard
            label="Confessions"
            value={data.stats.confessionCount}
            hint="Posted to the leaderboard"
          />
          <MetricCard
            label="Sins Logged"
            value={isOwner ? data.stats.sinCount : "—"}
            hint={isOwner ? "From Sin Engine" : "Private"}
          />
        </div>

        {isOwner && (
          <Surface accent="wine" accentTint>
            <h2 className="mb-2 font-serif text-lg font-semibold text-ink">Your Stats</h2>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>Mock indulgences purchased: {data.stats.purchaseCount}</li>
              <li>Total mock spend: ${Number(data.profile.total_spent).toFixed(2)}</li>
            </ul>
            <Link
              href="/indulgences"
              className="mt-4 inline-block text-sm text-wine hover:underline"
            >
              Visit the indulgence marketplace →
            </Link>
          </Surface>
        )}
      </PageShell>
      <Footer />
    </>
  );
}
