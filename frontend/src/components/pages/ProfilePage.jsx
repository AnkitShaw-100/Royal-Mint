import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { AppShell } from "@/components/AppShell";
import { Mail, User as UserIcon, Calendar } from "lucide-react";

export function ProfilePage() {
  return (
    <RequireAuth>
      <AppShell>
        <Profile />
      </AppShell>
    </RequireAuth>
  );
}
function Profile() {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!user) return;
    api.users
      .me(user.id)
      .then(setDbUser)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);
  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <h1 className="font-display text-3xl font-bold">Profile</h1>
      <div className="overflow-hidden rounded-3xl border border-border bg-surface/60">
        <div className="h-32 bg-gradient-to-r from-neon/30 via-neon/60 to-neon/30" />
        <div className="-mt-12 px-6 pb-6">
          <img
            src={user?.imageUrl}
            alt={user?.fullName ?? "Profile"}
            className="h-24 w-24 rounded-full border-4 border-background object-cover"
          />
          <h2 className="mt-4 font-display text-2xl font-bold">
            {user?.fullName ?? "—"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          {error}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <InfoRow
          icon={UserIcon}
          label="Clerk ID"
          value={user?.id ?? "—"}
          mono
        />
        <InfoRow
          icon={Mail}
          label="Email"
          value={user?.primaryEmailAddress?.emailAddress ?? "—"}
        />
        <InfoRow
          icon={Calendar}
          label="Member since"
          value={
            loading
              ? "Loading…"
              : dbUser?.createdAt
                ? new Date(dbUser.createdAt).toLocaleDateString()
                : "Not synced yet"
          }
        />
        <InfoRow
          icon={UserIcon}
          label="Database ID"
          value={loading ? "Loading…" : (dbUser?._id ?? "—")}
          mono
        />
      </div>
    </div>
  );
}
function InfoRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p
        className={`mt-1.5 truncate text-sm ${mono ? "font-mono text-neon" : "font-medium"}`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
