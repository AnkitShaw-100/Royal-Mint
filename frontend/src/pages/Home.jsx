import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowLeftRight, 
  History, 
  Receipt,
  ArrowRight,
  Wallet,
  Shield,
  Clock,
  Lock
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  const pages = [
    {
      title: 'Dashboard',
      description: 'Overview of your banking activity and quick stats',
      icon: LayoutDashboard,
      path: '/dashboard',
      gradient: 'from-blue-500 to-blue-600',
      badge: 'Overview',
    },
    {
      title: 'Accounts',
      description: 'View and manage your bank accounts',
      icon: Wallet,
      path: '/accounts',
      gradient: 'from-emerald-500 to-emerald-600',
      badge: 'Manage',
    },
    {
      title: 'Transactions',
      description: 'View all your transaction details',
      icon: Receipt,
      path: '/transactions',
      gradient: 'from-violet-500 to-violet-600',
      badge: 'Activity',
    },
    {
      title: 'Transfer',
      description: 'Send money to other accounts quickly',
      icon: ArrowLeftRight,
      path: '/transfer',
      gradient: 'from-orange-500 to-orange-600',
      badge: 'Send',
    },
    {
      title: 'History',
      description: 'Review your complete transaction history',
      icon: History,
      path: '/history',
      gradient: 'from-pink-500 to-pink-600',
      badge: 'Records',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: '256-bit encryption protects your data',
    },
    {
      icon: Clock,
      title: 'Instant Transfers',
      description: 'Real-time transaction processing',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data belongs only to you',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
          Welcome to Royal Mint Online Portal
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Complete Banking
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Command Center
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Access all your banking services in one secure location. 
          Manage accounts, transfer funds, and track transactions with ease.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, index) => {
          const Icon = page.icon;
          return (
            <Card 
              key={index} 
              className="group relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200"
              onClick={() => navigate(page.path)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${page.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <CardHeader className="space-y-4 relative">
                <div className="flex items-start justify-between">
                  <div className={`bg-gradient-to-br ${page.gradient} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium">
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
                  className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 font-semibold"
                >
                  Access {page.title}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 p-4 rounded-full">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>


    </div>
  );
}

export default Home;
