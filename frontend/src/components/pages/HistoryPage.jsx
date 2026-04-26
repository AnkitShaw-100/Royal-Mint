import { useUser } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";
import { api, formatCurrency } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";

const ITEMS_PER_PAGE = 7;

export function HistoryPage() {
  return (
    <RequireAuth>
      <AppShell>
        <History />
      </AppShell>
    </RequireAuth>
  );
}

function getAccountId(accountRef) {
  if (!accountRef) return null;
  if (typeof accountRef === "string") return accountRef;
  if (typeof accountRef === "object" && "_id" in accountRef) {
    return String(accountRef._id);
  }
  return null;
}

function History() {
  const { user } = useUser();
  const [txns, setTxns] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [t, a] = await Promise.all([
          api.transactions.list(user.id),
          api.accounts.list(user.id),
        ]);
        setTxns(t);
        setAccounts(a);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);
  const myAccountIds = useMemo(
    () => new Set(accounts.map((a) => a._id)),
    [accounts],
  );
  const filtered = useMemo(
    () =>
      txns
        .filter((t) =>
          filter === "IN"
            ? !myAccountIds.has(getAccountId(t.fromAccount))
            : filter === "OUT"
              ? myAccountIds.has(getAccountId(t.fromAccount))
              : true,
        )
        .filter((t) =>
          q ? t._id.toLowerCase().includes(q.toLowerCase()) : true,
        ),
    [txns, filter, q, myAccountIds],
  );

  useEffect(() => {
    setPage(1);
  }, [filter, q, txns.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const visible = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE);
  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div>
        <h1 className="font-display text-3xl font-bold">Transaction history</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-50 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by transaction id…"
            className="w-full rounded-full border border-border bg-surface/60 py-2.5 pl-10 pr-4 text-sm focus:border-neon focus:outline-none"
          />
        </div>
        <div className="flex rounded-full border border-border bg-surface/60 p-1">
          {["ALL", "IN", "OUT"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${filter === f ? "bg-neon text-neon-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f === "ALL" ? "All" : f === "IN" ? "Incoming" : "Outgoing"}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl border border-border bg-surface/40"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface/40">
            {visible.map((t, i) => {
            const isOut = myAccountIds.has(getAccountId(t.fromAccount));
            const Icon = isOut ? ArrowUpRight : ArrowDownLeft;
            return (
              <div
                key={t._id}
                className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-border" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                    <Icon
                      className={`h-4 w-4 ${isOut ? "text-foreground" : "text-neon"}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isOut ? "Sent" : "Received"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-mono text-sm font-semibold ${isOut ? "text-foreground" : "text-neon"}`}
                >
                  {isOut ? "−" : "+"}
                  {formatCurrency(t.amount)}
                </p>
              </div>
            );
            })}
            {visible.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No transactions found.
              </div>
            )}
          </div>

          {filtered.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between rounded-2xl border border-border bg-surface/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Showing {pageStart + 1} to {Math.min(pageStart + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xs font-semibold text-muted-foreground">
                  Page {safePage} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
