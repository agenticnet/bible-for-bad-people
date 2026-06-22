export default function LuciferTypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon-red/40 bg-neon-red/10">
        <span className="text-sm" aria-hidden="true">
          🔥
        </span>
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-neon-red/25 bg-shadow px-5 py-4">
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neon-red/80">
          Lucifer is scheming...
        </p>
        <div className="flex gap-1.5">
          <span className="typing-dot h-2 w-2 rounded-full bg-neon-red/60" />
          <span className="typing-dot h-2 w-2 rounded-full bg-neon-red/60" />
          <span className="typing-dot h-2 w-2 rounded-full bg-neon-red/60" />
        </div>
      </div>
    </div>
  );
}
