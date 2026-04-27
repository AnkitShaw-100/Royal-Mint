import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Zap,
  ShieldCheck,
  Repeat,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 md:pt-14">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            Live transactions API · idempotent transfers
          </div>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
            Move money between accounts in{" "}
            <span className="text-neon">milliseconds</span>.
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Royal Mint is a transactions system for sending money from one
            account to another. Double-entry ledger, immutable records, and a
            clean API — built for builders and finance teams.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-neon-foreground transition hover:opacity-90"
            >
              Open dashboard
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface"
            >
              How it works
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
            <Tag icon={Zap} label="P50 < 80ms" />
            <Tag icon={ShieldCheck} label="Immutable ledger" />
            <Tag icon={Repeat} label="Idempotent" />
          </div>
        </div>

        {/* Right: live transaction stream mockup */}
        <LiveTxnPanel />
      </div>
    </section>
  );
}

function Tag({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-neon" />
      {label}
    </div>
  );
}

const sample = [
  {
    from: "ACME-OPS",
    to: "PAYROLL-7821",
    amt: 4250.0,
    dir: "out",
    status: "Completed",
    time: "now",
  },
  {
    from: "STRIPE-CONNECT",
    to: "ACME-OPS",
    amt: 18920.55,
    dir: "in",
    status: "Completed",
    time: "12s",
  },
  {
    from: "ACME-OPS",
    to: "VENDOR-9012",
    amt: 312.4,
    dir: "out",
    status: "Completed",
    time: "48s",
  },
  {
    from: "REFUND-POOL",
    to: "USER-44021",
    amt: 27.0,
    dir: "out",
    status: "Pending",
    time: "1m",
  },
  {
    from: "USER-22094",
    to: "ACME-OPS",
    amt: 99.0,
    dir: "in",
    status: "Completed",
    time: "3m",
  },
];

function LiveTxnPanel() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 mx-auto h-[380px] w-[380px] translate-y-10 rounded-full bg-neon/15 blur-3xl"
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-card backdrop-blur">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-border bg-surface-elevated/60 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-neon/60" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            royal-mint.app/transactions
          </span>
          <span className="text-[10px] text-neon">● LIVE</span>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Cleared today
            </p>
            <p className="font-display text-3xl font-bold text-neon">
              $1,284,902.16
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Transfers
            </p>
            <p className="font-display text-3xl font-bold">12,847</p>
          </div>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {sample.map((t, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  t.dir === "in"
                    ? "bg-neon/15 text-neon"
                    : "bg-surface-elevated text-foreground/70"
                }`}
              >
                {t.dir === "in" ? (
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                ) : (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs">
                  {t.from} <span className="text-muted-foreground">→</span>{" "}
                  {t.to}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t.status === "Completed" ? (
                    <Check className="mr-1 inline h-3 w-3 text-neon" />
                  ) : null}
                  {t.status} · {t.time}
                </p>
              </div>
              <p
                className={`font-mono text-sm font-semibold ${
                  t.dir === "in" ? "text-neon" : "text-foreground"
                }`}
              >
                {t.dir === "in" ? "+" : "−"}$
                {t.amt.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
