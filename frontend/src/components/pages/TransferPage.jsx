import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { api, formatCurrency } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { ArrowRight, Send, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TransferPage() {
  return (
    <RequireAuth>
      <AppShell>
        <Transfer />
      </AppShell>
    </RequireAuth>
  );
}

function Transfer() {
  const { user } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const senderAccounts = accounts.filter((a) => a.status === "ACTIVE");

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const accs = await api.accounts.list(user.id);
        setAccounts(accs);
        const defaultAccount = accs.find((a) => a.status === "ACTIVE") ?? null;
        if (defaultAccount) {
          setFrom(defaultAccount._id);
        } else {
          setFrom("");
        }
        const bals = await Promise.all(
          accs.map((a) =>
            api.accounts
              .balance(user.id, a._id)
              .then((b) => [a._id, b.balance]),
          ),
        );
        setBalances(Object.fromEntries(bals));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [user]);
  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(null);
    const amt = parseFloat(amount);
    if (!from) return setError("No sender account found.");
    if (!to.trim()) return setError("Receiver account ID is required.");
    if (from === to.trim()) return setError("From and To must be different.");
    if (!Number.isFinite(amt) || amt <= 0)
      return setError("Enter a valid amount.");
    const senderBalance = Number(balances[from] ?? 0);
    if (amt > senderBalance) {
      return setError(
        `Insufficient balance. Available: ${formatCurrency(senderBalance, fromAcc?.currency ?? "INR")}`,
      );
    }
    setSubmitting(true);
    try {
      const txn = await api.transactions.create(user.id, {
        fromAccount: from,
        toAccount: to.trim(),
        amount: amt,
        idempotencyKey: crypto.randomUUID(),
      });
      setSuccess(
        `Transfer ${txn._id.slice(-6).toUpperCase()} ${txn.status.toLowerCase()}.`,
      );
      setAmount("");
      const bals = await Promise.all(
        accounts.map((a) =>
          api.accounts.balance(user.id, a._id).then((b) => [a._id, b.balance]),
        ),
      );
      setBalances(Object.fromEntries(bals));
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };
  const fromAcc = accounts.find((a) => a._id === from);
  return (
    <div className="pb-24 md:pb-0">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Send money</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Move money between your Royal Mint accounts instantly.
        </p>
      </div>
      <form
        onSubmit={submit}
        className="grid gap-6 rounded-3xl border border-border bg-surface/60 p-6 md:p-8"
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] md:items-center">
          <Field label="Sender account">
            <Select
              value={from}
              onValueChange={setFrom}
              disabled={senderAccounts.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sender account" />
              </SelectTrigger>
              <SelectContent>
                {senderAccounts.map((a) => (
                  <SelectItem key={a._id} value={a._id}>
                    {`${a.currency} • ${formatCurrency(balances[a._id] ?? 0, a.currency)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromAcc && (
              <p className="mt-2 text-xs text-muted-foreground">
                Selected sender ID: {fromAcc._id}
              </p>
            )}
          </Field>
          <ArrowRight className="mx-auto hidden h-5 w-5 self-center text-muted-foreground md:block" />
          <Field label="Receiver account ID">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter receiver account ID"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-neon focus:outline-none"
            />
          </Field>
        </div>
        <Field label="Amount">
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-5 font-display text-3xl font-bold focus:border-neon focus:outline-none"
            />
            {fromAcc && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {fromAcc.currency}
              </span>
            )}
          </div>
        </Field>
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-2xl border border-neon/40 bg-neon/10 p-3 text-sm text-neon">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting || senderAccounts.length === 0 || !fromAcc}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-neon px-6 py-4 text-sm font-semibold text-neon-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitting ? "Sending…" : "Send transfer"}
        </button>
        {senderAccounts.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            You need at least one active account to send money.
          </p>
        )}
      </form>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
