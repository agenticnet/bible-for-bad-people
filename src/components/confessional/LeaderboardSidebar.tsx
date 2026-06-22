import type { Confession } from "@/lib/confessionalTypes";

interface LeaderboardSidebarProps {
  mostAbsolved: Confession[];
  mostCondemned: Confession[];
}

export default function LeaderboardSidebar({
  mostAbsolved,
  mostCondemned,
}: LeaderboardSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      <LeaderboardList
        title="Most Absolved"
        subtitle="Community saints (for now)"
        items={mostAbsolved}
        metric="absolve"
        accent="green"
      />
      <LeaderboardList
        title="Most Condemned"
        subtitle="Hell-bound hall of fame"
        items={mostCondemned}
        metric="condemn"
        accent="red"
      />
    </aside>
  );
}

function LeaderboardList({
  title,
  subtitle,
  items,
  metric,
  accent,
}: {
  title: string;
  subtitle: string;
  items: Confession[];
  metric: "absolve" | "condemn";
  accent: "green" | "red";
}) {
  const accentClass = accent === "green" ? "text-green-400" : "text-neon-red";

  return (
    <div className="rounded-xl border border-ash bg-shadow p-4">
      <h3 className="mb-0.5 text-sm font-semibold text-bone">{title}</h3>
      <p className="mb-3 text-[10px] text-muted">{subtitle}</p>
      <ol className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-2 text-xs">
            <span className={`shrink-0 font-mono font-bold ${accentClass}`}>
              {i + 1}.
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-muted">u/{item.authorLabel}</p>
              <p className="line-clamp-2 text-bone/80">{item.content}</p>
              <p className={`mt-0.5 font-mono ${accentClass}`}>
                {metric === "absolve" ? item.absolveVotes : item.condemnVotes}{" "}
                {metric === "absolve" ? "absolutions" : "condemnations"}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
