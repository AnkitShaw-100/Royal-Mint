import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { api, formatCurrency } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { Plus, MoreVertical, Lock, Unlock, Trash2 } from "lucide-react";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];

export function AccountsPage() {
  return (
    <RequireAuth>
      <AppShell>
        <Accounts />
      </AppShell>
    </RequireAuth>
  );
}

function Accounts() {
  const { user } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("INR");
  const load = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const accs = await api.accounts.list(user.id);
      setAccounts(accs);
      const bals = await Promise.all(
        accs.map((a) =>
          api.accounts.balance(user.id, a._id).then((b) => [a._id, b.balance]),
        ),
      );
      setBalances(Object.fromEntries(bals));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const create = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await api.accounts.create(user.id, { currency });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const setStatus = async (id, status) => {
    if (!user) return;
    try {
      await api.accounts.setStatus(user.id, id, status);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const remove = async (id) => {
    if (!user) return;
    if (!confirm("Close this account?")) return;
    try {
      await api.accounts.remove(user.id, id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your accounts and currencies.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface/60 p-1">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-full bg-transparent px-3 py-1.5 text-sm focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-surface">
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={create}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-neon px-4 py-1.5 text-sm font-semibold text-neon-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>
      </div>
      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-3xl border border-border bg-surface/40"
            />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface/40 p-12 text-center">
          <h3 className="font-display text-xl font-bold">No accounts yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first Royal Mint account above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((a) => (
            <AccountCard
              key={a._id}
              account={a}
              balance={balances[a._id] ?? 0}
              onFreeze={() => setStatus(a._id, "FROZEN")}
              onActivate={() => setStatus(a._id, "ACTIVE")}
              onClose={() => remove(a._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
function AccountCard({ account, balance, onFreeze, onActivate, onClose }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative rounded-2xl border border-border bg-surface/60 p-6 transition hover:border-neon/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account · {account.currency}
          </p>
          <p className="mt-3 font-mono text-xs text-foreground/80">
            acc_{account._id.slice(-10)}
          </p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-6 font-display text-3xl font-bold text-neon">
        {formatCurrency(balance, account.currency)}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${account.status === "ACTIVE" ? "bg-neon/20 text-neon" : account.status === "FROZEN" ? "bg-blue-500/20 text-blue-300" : "bg-muted text-muted-foreground"}`}
        >
          {account.status}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Opened {new Date(account.createdAt).toLocaleDateString()}
        </span>
      </div>
      {open && (
        <div className="absolute right-4 top-12 z-10 w-44 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          {account.status === "ACTIVE" ? (
            <button
              onClick={() => {
                setOpen(false);
                onFreeze();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface"
            >
              <Lock className="h-3.5 w-3.5" />
              Freeze
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                onActivate();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface"
            >
              <Unlock className="h-3.5 w-3.5" />
              Activate
            </button>
          )}
          <button
            onClick={() => {
              setOpen(false);
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-surface"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Close account
          </button>
        </div>
      )}
    </div>
  );
}
