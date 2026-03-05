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
      title: "Transactions",
      description: "View all your transaction details",
      icon: Receipt,
      path: "/transactions",
      color: "bg-violet-600",
      badge: "Activity",
    },
    {
      title: "Transfer",
      description: "Send money to other accounts quickly",
      icon: ArrowLeftRight,
      path: "/transfer",
      color: "bg-orange-600",
      badge: "Send",
    },
    {
      title: "History",
      description: "Review your complete transaction history",
      icon: History,
      path: "/history",
      color: "bg-pink-600",
      badge: "Records",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "256-bit encryption protects your data",
      color: "bg-blue-600",
    },
    {
      icon: Clock,
      title: "Instant Transfers",
      description: "Real-time transaction processing",
      color: "bg-purple-600",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data belongs only to you",
      color: "bg-emerald-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance",
      color: "bg-orange-600",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your account from anywhere",
      color: "bg-indigo-600",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Always here to help you",
      color: "bg-rose-600",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Transactions", value: "1M+", icon: TrendingUp },
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
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-12 relative">
        <Badge className="px-6 py-2 text-sm font-semibold bg-blue-100 text-blue-700 border-0 pointer-events-none">
          <Sparkles className="w-4 h-4 inline mr-2" />
          Welcome to Royal Mint Online Portal
        </Badge>
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Your Complete Banking
          <br />
          <span className="text-blue-600">
            Command Center
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Access all your banking services in one secure location. Manage
          accounts, transfer funds, and track transactions with ease.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg border-2 hover:bg-gray-50"
            onClick={() => navigate("/transfer")}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="text-center border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="pt-6 space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation Cards */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">Quick Access</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your finances, all in one place
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => {
            const Icon = page.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 hover:-translate-y-1"
                onClick={() => navigate(page.path)}
              >
                <CardHeader className="space-y-4 relative">
                  <div className="flex items-start justify-between">
                    <div
                      className={`${page.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="text-xs font-semibold bg-blue-600 text-white border-0">
                      {page.badge}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                      {page.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2 leading-relaxed">
                      {page.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 font-semibold transition-all"
                  >
                    Access {page.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-16" />

      {/* How It Works Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <Badge className="px-4 py-2 bg-purple-600 text-white border-0">
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps and experience seamless banking
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                <Card className="text-center border-2 hover:border-purple-200 hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="pt-12 pb-8 space-y-6">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-20"></div>
                      <div className="relative bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <Badge className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white text-purple-600 font-bold border-2 border-purple-300">
                        {item.step}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="my-16" />

      {/* Features Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <Badge className="px-4 py-2 bg-blue-600 text-white border-0">
            Why Choose Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience banking with cutting-edge technology and security
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group border-2 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-8 pb-6 space-y-4">
                  <div className={`inline-flex p-4 rounded-2xl ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-16" />

      {/* Trust Indicators */}
      <div className="bg-gray-50 rounded-3xl p-12 border-2 border-gray-200">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join the community of satisfied users who trust us with their finances
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle2, text: "Bank-Level Security" },
              { icon: Shield, text: "Data Protection" },
              { icon: Star, text: "5-Star Rated" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-green-600 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-3xl bg-blue-600">
        <div className="relative text-center py-20 px-8 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of users managing their finances securely and efficiently
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
              onClick={() => navigate("/dashboard")}
            >
              Open Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              onClick={() => navigate("/transfer")}
            >
              Start Transfer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
