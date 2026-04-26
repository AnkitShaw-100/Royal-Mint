import { Sparkles, Send, Globe, Mail, Star } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: ["Features", "How it works", "Pricing", "Changelog"],
  },
  {
    title: "Developers",
    links: ["API reference", "Idempotency", "Webhooks", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Security", "Contact", "Terms"],
  },
];

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-10">
      <div className="rounded-3xl border border-border bg-surface/40 p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neon" strokeWidth={2.5} />
              <span className="font-display text-lg font-bold">Royal Mint</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A transactions and ledger system for moving money between
              accounts. Idempotent, immutable, instant.
            </p>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              api.royalmint.app
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition hover:text-neon"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Royal Mint. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Send, Globe, Mail, Star].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-full border border-border bg-background p-2 text-muted-foreground transition hover:border-neon hover:text-neon"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 select-none text-center font-display text-7xl font-bold tracking-tighter text-neon md:text-9xl">
        Royal Mint
      </div>
    </footer>
  );
}
