import { Database, Zap, Lock, Repeat, Webhook, LineChart } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Double-entry ledger",
    text: "Every transfer creates matched debit and credit entries. Immutable, auditable, append-only.",
  },
  {
    icon: Repeat,
    title: "Idempotent transfers",
    text: "Built-in idempotency keys prevent double-charges on retries. Safe to call from any client.",
  },
  {
    icon: Zap,
    title: "Sub-100ms posting",
    text: "Optimised write path posts most transactions in under 80ms end-to-end.",
  },
  {
    icon: Lock,
    title: "Account states",
    text: "ACTIVE, FROZEN, CLOSED — enforce business rules at the account level, not in code.",
  },
  {
    icon: Webhook,
    title: "Email notifications",
    text: "Receipts and failure alerts delivered automatically for every transaction event.",
  },
  {
    icon: LineChart,
    title: "Full transaction history",
    text: "Search, filter and export every movement. Reconcile in seconds, not hours.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto mt-32 max-w-6xl px-4">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-neon">
          Capabilities
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold leading-tight md:text-5xl">
          Everything you need to move money safely.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Royal Mint is a transactions engine — not a bank. Open accounts,
          transfer between them, and reconcile with confidence.
        </p>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="group bg-background p-6 transition hover:bg-surface/60"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-neon">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
