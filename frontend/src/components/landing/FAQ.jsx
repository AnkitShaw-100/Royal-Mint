import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Is Royal Mint a bank?",
    a: "No. Royal Mint is a transactions and ledger system. It moves money between accounts you define — it does not hold customer deposits or issue cards.",
  },
  {
    q: "What does idempotency mean here?",
    a: "Every transfer accepts an idempotencyKey. If a request is retried (network blip, client retry, etc.) the system returns the original transaction instead of creating a duplicate.",
  },
  {
    q: "Can ledger entries be edited or deleted?",
    a: "Never. The ledger is append-only by design. Reversals create new offsetting entries so the audit trail is always intact.",
  },
  {
    q: "What happens to a transfer to a FROZEN account?",
    a: "Transfers involving non-ACTIVE accounts are rejected at the API layer with a clear error. No partial ledger writes occur.",
  },
  {
    q: "Do you send notifications?",
    a: "Yes — registration, transfer success, and transfer failure events trigger email notifications. Failures degrade gracefully if the email service is down.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto mt-32 max-w-3xl px-4">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-neon">
          FAQ
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">
          Questions, answered.
        </h2>
      </div>

      <div className="mt-10 space-y-2">
        {faqs.map((f, i) => (
          <Item key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}

function Item({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="block w-full rounded-2xl border border-border bg-surface/40 p-5 text-left transition hover:bg-surface/70"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-base font-semibold">{q}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-neon">
          {open ? (
            <Minus className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
        </span>
      </div>
      {open && <p className="mt-3 text-sm text-muted-foreground">{a}</p>}
    </button>
  );
}
