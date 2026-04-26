import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { isClerkConfigured } from "@/lib/clerk";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const links = [
  { label: "Features", to: "/#features" },
  { label: "How it works", to: "/#how" },
  { label: "FAQ", to: "/#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="flex items-center justify-between gap-4 rounded-full border border-border bg-background/70 px-4 py-2 backdrop-blur-xl shadow-card">
          <Link to="/" className="flex items-center gap-2 pl-2">
            <Sparkles className="h-5 w-5 text-neon" strokeWidth={2.5} />
            <span className="font-display text-lg font-bold tracking-tight">
              Royal Mint
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.to}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-surface hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {isClerkConfigured ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="hidden rounded-full bg-neon px-5 py-2 text-sm font-semibold text-neon-foreground transition hover:opacity-90 md:inline-flex">
                      Sign Up →
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    to="/dashboard"
                    className="hidden rounded-full bg-neon px-5 py-2 text-sm font-semibold text-neon-foreground transition hover:opacity-90 md:inline-flex"
                  >
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="hidden rounded-full bg-neon px-5 py-2 text-sm font-semibold text-neon-foreground transition hover:opacity-90 md:inline-flex"
              >
                Sign Up →
              </Link>
            )}

            <button
              className="rounded-full bg-surface p-2 md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="mt-2 rounded-3xl border border-border bg-background/90 p-4 backdrop-blur-xl md:hidden">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
