import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatCurrency } from "@/lib/api";
import { useSyncUser } from "@/hooks/useSyncUser";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Wallet,
  TrendingUp,
} from "lucide-react";

export function DashboardPage() {
  return (
    <RequireAuth>
      <AppShell>
        <Dashboard />
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

function Dashboard() {
  const { user } = useUser();
  useSyncUser();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [accs, ts] = await Promise.all([
          api.accounts.list(user.id),
          api.transactions.list(user.id),
        ]);
        if (cancelled) return;
        setAccounts(accs);
        setTxns(ts);
        const bals = await Promise.all(
          accs.map((a) =>
            api.accounts
              .balance(user.id, a._id)
              .then((b) => [a._id, b.balance]),
          ),
        );
        if (cancelled) return;
        setBalances(Object.fromEntries(bals));
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);
  const total = Object.values(balances).reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.firstName ?? "there"} 👋
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold">Your Dashboard</h1>
      </div>
      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 overflow-hidden rounded-2xl border border-border bg-surface/60 p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Net position
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neon/10 px-2 py-0.5 text-[10px] font-semibold text-neon">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
              Live
            </span>
          </div>
          <p className="mt-3 font-display text-5xl font-bold text-neon">
            {loading ? "—" : formatCurrency(total)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Across {accounts.length}{" "}
            {accounts.length === 1 ? "account" : "accounts"}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/transfer"
              className="inline-flex items-center gap-2 rounded-full bg-neon px-4 py-2 text-sm font-semibold text-neon-foreground transition hover:opacity-90"
            >
              <ArrowUpRight className="h-4 w-4" />
              Send transfer
            </Link>
            <Link
              to="/accounts"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface"
            >
              <Plus className="h-4 w-4" />
              New account
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <Stat
            icon={Wallet}
            label="Accounts"
            value={String(accounts.length)}
          />
          <Stat
            icon={TrendingUp}
            label="Transactions"
            value={String(txns.length)}
          />
        </div>
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Your accounts</h2>
          <Link to="/accounts" className="text-sm text-neon hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <SkeletonRows />
        ) : accounts.length === 0 ? (
          <EmptyState
            title="No accounts yet"
            text="Create your first account to start sending money."
            cta={{ to: "/accounts", label: "Create account" }}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {accounts.slice(0, 4).map((a) => (
              <AccountCard
                key={a._id}
                account={a}
                balance={balances[a._id] ?? 0}
              />
            ))}
          </div>
        )}
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recent activity</h2>
          <Link to="/history" className="text-sm text-neon hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <SkeletonRows />
        ) : txns.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            text="Your transfers will appear here."
            cta={{ to: "/transfer", label: "Send money" }}
          />
        ) : (
          <div className="rounded-3xl border border-border bg-surface/40 divide-y divide-border">
            {txns.slice(0, 6).map((t) => (
              <TxnRow key={t._id} txn={t} accounts={accounts} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background">
        <Icon className="h-4 w-4 text-neon" />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
function AccountCard({ account, balance }) {
  return (
    <Link
      to="/accounts"
      className="group block rounded-3xl border border-border bg-surface/60 p-5 transition hover:border-neon/40"
    >
      <div className="flex items-center justify-between">
        <div className="font-mono text-xs text-muted-foreground">
          •••• {account._id.slice(-6).toUpperCase()}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${account.status === "ACTIVE" ? "bg-neon/20 text-neon" : "bg-muted text-muted-foreground"}`}
        >
          {account.status}
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{account.currency}</p>
      <p className="font-display text-2xl font-bold">
        {formatCurrency(balance, account.currency)}
      </p>
    </Link>
  );
}
function TxnRow({ txn, accounts }) {
  const fromAccountId = getAccountId(txn.fromAccount);
  const toAccountId = getAccountId(txn.toAccount);
  const isOutgoing = accounts.some((a) => a._id === fromAccountId);
  const Icon = isOutgoing ? ArrowUpRight : ArrowDownLeft;
  const relevantAccountId = isOutgoing ? fromAccountId : toAccountId;
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
          <Icon
            className={`h-4 w-4 ${isOutgoing ? "text-foreground" : "text-neon"}`}
          />
        </div>
        <div>
          <p className="text-sm font-medium">
            {isOutgoing ? "Sent" : "Received"}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(txn.createdAt).toLocaleString()}
          </p>
          {relevantAccountId && (
            <p className="text-[10px] text-muted-foreground">
              {isOutgoing ? "From" : "To"} ••••
              {String(relevantAccountId).slice(-6).toUpperCase()}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-mono text-sm font-semibold ${isOutgoing ? "text-foreground" : "text-neon"}`}
        >
          {isOutgoing ? "−" : "+"}
          {formatCurrency(txn.amount)}
        </p>
        <p className="text-[10px] text-muted-foreground">{txn.status}</p>
      </div>
    </div>
  );
}
function SkeletonRows() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-2xl border border-border bg-surface/40"
        />
      ))}
    </div>
  );
}
function EmptyState({ title, text, cta }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/40 p-10 text-center">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      <Link
        to={cta.to}
        className="mt-4 inline-flex rounded-full bg-neon px-5 py-2 text-sm font-semibold text-neon-foreground"
      >
        {cta.label}
      </Link>
    </div>
  );
}
