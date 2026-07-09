import type { Confession } from "@/lib/confessionalTypes";
import { Surface } from "@/components/ui";
import { accentStyles, statusStyles } from "@/components/ui/tokens";

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
        accentClass={statusStyles.success.text}
      />
      <LeaderboardList
        title="Most Condemned"
        subtitle="Hell-bound hall of fame"
        items={mostCondemned}
        metric="condemn"
        accentClass={accentStyles.ember.text}
      />
    </aside>
  );
}

function LeaderboardList({
  title,
  subtitle,
  items,
  metric,
  accentClass,
}: {
  title: string;
  subtitle: string;
  items: Confession[];
  metric: "absolve" | "condemn";
  accentClass: string;
}) {
  return (
    <Surface padding="sm">
      <h3 className="mb-0.5 text-sm font-semibold text-ink">{title}</h3>
      <p className="verse-ref mb-3 text-ink-soft">{subtitle}</p>
      <ol className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-2 text-xs">
            <span className={`shrink-0 font-mono font-bold ${accentClass}`}>
              {i + 1}.
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-ink-soft">{item.authorLabel}</p>
              <p className="line-clamp-2 text-ink-soft">{item.content}</p>
              <p className={`mt-0.5 font-mono ${accentClass}`}>
                {metric === "absolve" ? item.absolveVotes : item.condemnVotes}{" "}
                {metric === "absolve" ? "absolutions" : "condemnations"}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Surface>
  );
}
