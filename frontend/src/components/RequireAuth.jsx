import { useUser } from "@clerk/clerk-react";
import { isClerkConfigured } from "@/lib/clerk";
import { Link } from "react-router-dom";

/**
 * Wrap any authenticated page. Renders a friendly notice if Clerk
 * isn't configured yet (so the app builds and runs without keys).
 */
export function RequireAuth({ children }) {
  if (!isClerkConfigured) {
    return <ClerkSetupNotice />;
  }
  return <ClerkGate>{children}</ClerkGate>;
}

function ClerkGate({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-3xl border border-border bg-surface/60 p-10 text-center">
        <h2 className="font-display text-2xl font-bold">Sign in required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You need an account to access your Royal Mint dashboard.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-neon-foreground"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

function ClerkSetupNotice() {
  return (
    <div className="mx-auto mt-20 max-w-xl rounded-3xl border border-border bg-surface/60 p-10">
      <div className="inline-flex rounded-full bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
        Setup required
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold">
        Connect Clerk to enable auth
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Set{" "}
        <code className="rounded bg-background px-1.5 py-0.5 text-neon">
          VITE_CLERK_PUBLISHABLE_KEY
        </code>{" "}
        in your environment, or paste your key into{" "}
        <code className="rounded bg-background px-1.5 py-0.5 text-neon">
          src/lib/clerk.js
        </code>
        . Once configured, sign-in and your authenticated dashboard will
        activate automatically.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Your backend URL is read from{" "}
        <code className="rounded bg-background px-1.5 py-0.5 text-neon">
          VITE_API_URL
        </code>{" "}
        (defaults to{" "}
        <code className="text-neon">http://localhost:5000/api</code>).
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-neon-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}
