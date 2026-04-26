import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  History,
  User,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { isClerkConfigured } from "@/lib/clerk";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/transfer", label: "Transfer", icon: ArrowLeftRight },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }) {
  const loc = useLocation();

  return (
    <div className="min-h-5/6">
      <div className="mx-auto flex max-w-6xl gap-5 px-4 pt-8 pb-5">
        {/* Sidebar */}
        <aside className="sticky top-8 hidden h-[88vh] w-52 shrink-0 flex-col rounded-3xl border border-border bg-surface/60 p-3 md:flex">
          <Link to="/" className="mb-8 flex items-center gap-2 px-2 pt-2">
            <Sparkles className="h-5 w-5 text-neon" strokeWidth={2.5} />
            <span className="font-display text-base font-bold">Royal Mint</span>
          </Link>

          <nav className="flex flex-col gap-1">
            {nav.map((n) => {
              const active = loc.pathname === n.to;
              const Icon = n.icon;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium transition ${active ? "bg-neon text-neon-foreground" : "text-muted-foreground hover:bg-background hover:text-foreground"}`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="mb-5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 md:hidden">
              <Sparkles className="h-5 w-5 text-neon" strokeWidth={2.5} />
              <span className="font-display text-base font-bold">
                Royal Mint
              </span>
            </Link>
            <div className="ml-auto flex items-center gap-3">
              {isClerkConfigured && <UserButton afterSignOutUrl="/" />}
            </div>
          </header>

          {children}

          {/* Mobile bottom nav */}
          <nav className="fixed bottom-3 left-3 right-3 z-40 flex items-center justify-around rounded-full border border-border bg-background/90 p-1.5 backdrop-blur-xl md:hidden">
            {nav.map((n) => {
              const active = loc.pathname === n.to;
              const Icon = n.icon;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    active
                      ? "bg-neon text-neon-foreground"
                      : "text-muted-foreground"
                  }`}
                  aria-label={n.label}
                >
                  <Icon className="h-3.5 w-3.5" />
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
