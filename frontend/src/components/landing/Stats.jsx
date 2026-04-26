const stats = [
  { n: "$2.4B", label: "Cleared volume" },
  { n: "47ms", label: "Median post time" },
  { n: "99.99%", label: "Uptime (90d)" },
  { n: "0", label: "Lost ledger entries" },
];

export function Stats() {
  return (
    <section className="mx-auto mt-32 max-w-6xl px-4">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background p-8 text-center">
            <p className="font-display text-4xl font-bold text-neon md:text-5xl">
              {s.n}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
