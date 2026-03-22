import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftRight,
  History,
  Receipt,
  ArrowRight,
  Shield,
  Clock,
  Lock,
  Zap,
  Users,
  TrendingUp,
  Star,
  CheckCircle2,
  Sparkles,
  Globe,
  CreditCard,
  Smartphone,
  HeadphonesIcon,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const pages = [
    {
      title: "Transfer",
      description: "Send money to other accounts quickly",
      icon: ArrowLeftRight,
      path: "/transfer",
      color: "bg-orange-500",
      gradientFrom: "from-orange-500",
      gradientTo: "to-orange-600",
      badge: "Send",
      accent: "text-orange-600",
      lightBg: "bg-orange-50",
    },
    {
      title: "Ledger History",
      description: "Review your complete ledger entries",
      icon: History,
      path: "/history",
      color: "bg-pink-500",
      gradientFrom: "from-pink-500",
      gradientTo: "to-pink-600",
      badge: "Records",
      accent: "text-pink-600",
      lightBg: "bg-pink-50",
    },
    {
      title: "Accounts",
      description: "Manage your bank accounts",
      icon: Receipt,
      path: "/accounts",
      color: "bg-violet-500",
      gradientFrom: "from-violet-500",
      gradientTo: "to-violet-600",
      badge: "Manage",
      accent: "text-violet-600",
      lightBg: "bg-violet-50",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Account",
      description: "Sign up in minutes with secure authentication",
      icon: Users,
    },
    {
      step: "02",
      title: "Add Funds",
      description: "Link your bank account or card securely",
      icon: CreditCard,
    },
    {
      step: "03",
      title: "Start Transacting",
      description: "Send money instantly to anyone, anywhere",
      icon: Zap,
    },
  ];

  const trustItems = [
    {
      icon: CheckCircle2,
      text: "Bank-Level Security",
      description:
        "Passwords encrypted with industry-standard hashing algorithms for maximum protection",
    },
    {
      icon: Shield,
      text: "Secure Transfers",
      description:
        "Send & receive money directly between accounts with complete transparency",
    },
    {
      icon: Star,
      text: "Real-Time Notifications",
      description:
        "Instant email alerts for all transfers - both sent and received",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "$50M+", label: "Volume" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="space-y-20 pb-16">

      {/* ── Hero ── */}
      <section className="relative text-center space-y-6 pt-12 pb-4 max-w-5xl mx-auto overflow-hidden">
        {/* Soft blurred blobs */}
        <div className="pointer-events-none absolute -top-20 -left-32 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="pointer-events-none absolute -top-10 -right-24 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40" />

        <Badge className="inline-flex items-center gap-2 px-5 py-1.5 text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full pointer-events-none">
          <Sparkles className="w-4 h-4" />
          Welcome to Royal Mint Online Portal
        </Badge>

        <h1 className="relative text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
          Your Complete Banking
          <br />
          <span className="text-blue-600">Command Center</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Access all your banking services in one secure location. Manage
          accounts, transfer funds, and track your ledger with ease.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-base font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-5 text-base font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </div>

        {/* Subtle stat strip */}
        <div className="flex items-center justify-center gap-8 pt-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Access ── */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Quick Access
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Everything you need to manage your finances, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pages.map((page, index) => {
            const Icon = page.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden cursor-pointer border border-gray-100 bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-gray-200"
                onClick={() => navigate(page.path)}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${page.gradientFrom} ${page.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <CardHeader className="space-y-5 pb-3 pt-7 px-7">
                  <div className="flex items-start justify-between">
                    <div className={`${page.lightBg} p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110`}>
                      <Icon className={`w-6 h-6 ${page.accent}`} />
                    </div>
                    <Badge className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 border-0 rounded-full">
                      {page.badge}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {page.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 leading-relaxed">
                      {page.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="px-7 pb-7 pt-2">
                  <Button className="w-full font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    Access {page.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
            Get started in three simple steps and experience seamless banking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-13 left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] h-px bg-linear-to-r from-blue-200 via-blue-300 to-blue-200 z-0" />

          {howItWorks.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="relative z-10 text-center border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-10 pb-8 space-y-5 px-8">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 scale-150" />
                    <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-blue-600">{item.step}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Trust Indicators ── */}
      <section className="py-4">
        <div className="text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Trusted by Thousands
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
              Join the community of satisfied users who trust us with their finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 text-left"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="relative space-y-4">
                    <div className="inline-flex p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{item.text}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-600 to-indigo-700 shadow-2xl shadow-blue-200">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative text-center py-16 px-6 md:px-12 space-y-10">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Ready to Take Control
              <br />
              of Your Finances?
            </h2>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who are already managing their finances
              securely and efficiently with Royal Mint.
            </p>
          </div>

          {/* Stats row inside CTA */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="text-white space-y-1">
                <div className="text-2xl md:text-3xl font-extrabold">{s.value}</div>
                <div className="text-xs text-blue-200 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-base min-w-44"
              onClick={() => navigate("/dashboard")}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-5 rounded-xl font-semibold text-base min-w-44 transition-all"
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;