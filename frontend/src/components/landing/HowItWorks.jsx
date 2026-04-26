import { ArrowDown } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Open an account",
    text: "Create one or more accounts, each scoped to a currency and status.",
    code: `POST /accounts/create
{ "currency": "USD", "status": "ACTIVE" }`,
  },
  {
    n: "02",
    title: "Initiate a transfer",
    text: "Send an idempotent request describing the source, destination, and amount.",
    code: `POST /transactions/create
{
  "fromAccount": "acc_a1b2",
  "toAccount":   "acc_x9y8",
  "amount": 250.00,
  "idempotencyKey": "txn_2024_0492"
}`,
  },
  {
    n: "03",
    title: "Ledger posts atomically",
    text: "A debit on the source and a credit on the destination land together. No partial state.",
    code: `// Ledger
DEBIT  acc_a1b2  250.00 USD
CREDIT acc_x9y8  250.00 USD`,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto mt-32 max-w-6xl px-4">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-neon">
          How it works
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold leading-tight md:text-5xl">
          From request to receipt — in three steps.
        </h2>
      </div>

      <div className="mt-12 space-y-4">
        {steps.map((s, i) => (
          <div key={s.n}>
            <div className="grid items-stretch gap-4 rounded-2xl border border-border bg-surface/40 p-6 md:grid-cols-[auto_1fr_1.2fr] md:gap-8">
              <div className="font-display text-4xl font-bold text-neon md:text-5xl">
                {s.n}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
              <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-[12px] leading-relaxed text-foreground/90">
                <code>{s.code}</code>
              </pre>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-2 text-muted-foreground">
                <ArrowDown className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
