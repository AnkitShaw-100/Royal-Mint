import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ArrowLeftRight,
  History as HistoryIcon,
  Building2,
  Menu,
  X,
  User,
  Shield,
} from "lucide-react";
import React from "react";
import LogoImg from "@/assets/Logo.png";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  const navItems = [
    { name: "Home", path: "/", icon: Building2, shortName: "Home" },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      shortName: "Dashboard",
    },
    {
      name: "Transfer",
      path: "/transfer",
      icon: ArrowLeftRight,
      shortName: "Transfer",
    },
  ];

  const rightNavItems = [
    { name: "Profile", path: "/profile", icon: User, shortName: "Profile" },
    ...(isAdmin
      ? [{ name: "Admin", path: "/admin", icon: Shield, shortName: "Admin" }]
      : []),
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-14 md:h-16 gap-4">
          {/* Logo - Responsive */}
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer group min-w-fit"
            onClick={() => navigate("/")}
          >
            <div className="group-hover:shadow-lg transition-all rounded-lg">
              <img
                src={LogoImg}
                alt="Royal Mint Logo"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
            </div>
            {/* Hide text on sm, show on md+ */}
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                Royal Mint
              </h1>
            </div>
          </div>

          {/* Desktop Navigation - Centered on larger devices */}
          <SignedIn>
            <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    className={`gap-1 xl:gap-2 text-xs lg:text-sm ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{item.name}</span>
                    <span className="inline xl:hidden">{item.shortName}</span>
                  </Button>
                );
              })}
            </nav>
          </SignedIn>

          {/* Right Section - Auth & Menu Toggle */}
          <div className="flex gap-2 md:gap-3 items-center ml-auto">
            {/* Right Navigation Items - Desktop Only */}
            <SignedIn>
              <div className="hidden md:flex items-center gap-1">
                {rightNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      size="sm"
                      className={`gap-1 xl:gap-2 text-xs lg:text-sm ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => navigate(item.path)}
                      title={item.name}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                    </Button>
                  );
                })}
              </div>
            </SignedIn>

            {/* Mobile Menu Button - Visible on lg and below */}
            <SignedIn>
              <button
                className="lg:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                )}
              </button>
            </SignedIn>

            {/* Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-xs md:text-sm text-gray-700 p-1 md:px-3"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm p-1 md:px-4">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>

            {/* User Button */}
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 md:w-10 md:h-10 ring-2 ring-gray-200 hover:ring-blue-500 transition-all",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>

        {/* Mobile/Tablet Navigation Menu - Visible on lg and below */}
        {mobileMenuOpen && (
          <SignedIn>
            <nav className="lg:hidden border-t border-gray-200 bg-linear-to-b from-white to-gray-50 animate-in fade-in slide-in-from-top-2">
              <div className="pb-3 pt-2 px-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={`w-full justify-start gap-3 px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-700 font-semibold hover:bg-blue-100"
                          : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                      }`}
                      onClick={() => handleNavClick(item.path)}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.name}</span>
                      {isActive && <span className="ml-auto text-xs">✓</span>}
                    </Button>
                  );
                })}

                {/* Divider */}
                <div className="my-2 border-t border-gray-200" />

                {/* Right Nav Items on Mobile */}
                {rightNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={`w-full justify-start gap-3 px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-700 font-semibold hover:bg-blue-100"
                          : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                      }`}
                      onClick={() => handleNavClick(item.path)}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.name}</span>
                      {isActive && <span className="ml-auto text-xs">✓</span>}
                    </Button>
                  );
                })}
              </div>
            </nav>
          </SignedIn>
        )}
      </div>
    </header>
  );
}
