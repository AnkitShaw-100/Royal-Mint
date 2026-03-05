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
import { Separator } from "@/components/ui/separator";
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
      color: "bg-orange-600",
      badge: "Send",
    },
    {
      title: "Ledger History",
      description: "Review your complete ledger entries",
      icon: History,
      path: "/history",
      color: "bg-pink-600",
      badge: "Records",
    },
    {
      title: "Accounts",
      description: "Manage your bank accounts",
      icon: Receipt,
      path: "/accounts",
      color: "bg-violet-600",
      badge: "Manage",
    },
  ];


  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Ledger Entries", value: "1M+", icon: TrendingUp },
    { label: "Success Rate", value: "99.9%", icon: Star },
    { label: "Countries", value: "50+", icon: Globe },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Account",
      description: "Sign up in minutes with secure authentication",
      icon: Users,
    },
    {
      step: "2",
      title: "Add Funds",
      description: "Link your bank account or card securely",
      icon: CreditCard,
    },
    {
      step: "3",
      title: "Start Transacting",
      description: "Send money instantly to anyone, anywhere",
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-14 pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-5 py-8 relative max-w-5xl mx-auto">
        <Badge className="px-5 py-1.5 text-sm font-semibold bg-blue-100 text-blue-700 border-0 pointer-events-none">
          <Sparkles className="w-4 h-4 inline mr-2" />
          Welcome to Royal Mint Online Portal
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Complete Banking
          <br />
          <span className="text-blue-600">Command Center</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Access all your banking services in one secure location. Manage
          accounts, transfer funds, and track your ledger with ease.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            className="bg-blue-600 text-white px-7 py-5 text-base shadow-lg transition-all"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-7 py-5 text-base border-2"
            onClick={() => navigate("/transfer")}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
              <Card key={index} className="text-center border transition-all duration-300">
                <CardContent className="pt-5 pb-5 space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-blue-600 rounded-full">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 leading-none">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation Cards */}
      <div className="space-y-7">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Quick Access</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your finances, all in one place
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((page, index) => {
            const Icon = page.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 border shadow-sm hover:shadow-md hover:border-blue-200"
                onClick={() => navigate(page.path)}
              >
                <CardHeader className="space-y-3.5 relative pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`${page.color} p-3 rounded-xl shadow-md transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="text-xs font-semibold bg-blue-600 text-white border-0">
                      {page.badge}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold transition-colors">
                      {page.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base mt-2 leading-relaxed text-gray-600">
                      {page.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="relative pt-0 pb-4">
                  <Button
                    variant="outline"
                    className="w-full font-semibold text-sm md:text-base transition-all group-hover:border-blue-300 group-hover:text-blue-700"
                  >
                    Access {page.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-16" />

      {/* How It Works Section */}
      <div className="space-y-10">
        <div className="text-center space-y-3">
          <Badge className="px-4 py-2 bg-blue-600 text-white border-0">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps and experience seamless banking
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorks.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                <Card className="text-center border transition-all duration-300 h-full">
                  <CardContent className="pt-10 pb-6 space-y-5">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20"></div>
                      <div className="relative bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white text-blue-600 font-bold border-2 border-blue-300">
                        {item.step}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="my-16" />

      {/* Trust Indicators */}
      <div className="py-12">
        <div className="text-center space-y-7">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by Thousands
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Join the community of satisfied users who trust us with their
              finances
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: CheckCircle2,
                text: "Bank-Level Security",
                description: "256-bit encryption",
              },
              {
                icon: Shield,
                text: "Data Protection",
                description: "GDPR compliant",
              },
              { icon: Star, text: "5-Star Rated", description: "10K+ reviews" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-3 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 text-base md:text-lg">
                        {item.text}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full -ml-40 -mb-40"></div>
        </div>
        <div className="relative text-center py-16 px-6 md:px-8 space-y-8">
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to Take Control
              <br />
              of Your Finances?
            </h2>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who are already managing their finances
              securely and efficiently with Royal Mint.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-base font-semibold shadow-xl hover:shadow-2xl transition-all"
              onClick={() => navigate("/dashboard")}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              className="border-2 border-white text-white px-8 py-6 text-base font-semibold backdrop-blur-sm"
              onClick={() => navigate("/transfer")}
            >
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
            <div className="text-white space-y-1">
              <div className="text-2xl md:text-3xl font-bold">10K+</div>
              <div className="text-sm text-blue-100">Active Users</div>
            </div>
            <div className="text-white space-y-1">
              <div className="text-2xl md:text-3xl font-bold">$50M+</div>
              <div className="text-sm text-blue-100">Volume</div>
            </div>
            <div className="text-white space-y-1">
              <div className="text-2xl md:text-3xl font-bold">99.9%</div>
              <div className="text-sm text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
