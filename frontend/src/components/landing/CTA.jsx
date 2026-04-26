import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function CTA() {
  return (
    <section className="mx-auto mt-32 max-w-6xl px-4">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/40 p-10 md:p-16">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-neon/10 to-transparent"
        />

        <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              Send your first transfer in{" "}
              <span className="text-neon">under a minute</span>.
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Open the dashboard, create two accounts, and post a transfer. No
              setup, no setup fees.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-neon-foreground transition hover:opacity-90"
            >
              Open dashboard
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="#how"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Or see how it works ↑
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
