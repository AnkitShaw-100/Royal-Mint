import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  TrendingUp,
  Wallet,
  Receipt,
  ArrowLeftRight,
  History as HistoryIcon
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const stats = [
    {
      title: 'Total Balance',
      value: '$12,345.67',
      change: '+12.5%',
      trend: 'up',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Income',
      value: '$8,432.90',
      change: '+8.2%',
      trend: 'up',
      icon: ArrowDownLeft,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Expenses',
      value: '$3,210.45',
      change: '-4.3%',
      trend: 'down',
      icon: ArrowUpRight,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Savings',
      value: '$5,222.22',
      change: '+15.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const quickActions = [
    {
      title: 'Transactions',
      description: 'View all transactions',
      path: '/transactions',
      icon: Receipt,
    },
    {
      title: 'Accounts',
      description: 'Manage accounts',
      path: '/accounts',
      icon: CreditCard,
    },
    {
      title: 'Transfer',
      description: 'Send money',
      path: '/transfer',
      icon: ArrowLeftRight,
    },
    {
      title: 'History',
      description: 'View history',
      path: '/history',
      icon: HistoryIcon,
    },
  ];

  const recentTransactions = [
    { name: 'Coffee Shop', amount: '-$4.50', date: 'Today', type: 'expense' },
    { name: 'Salary Deposit', amount: '+$3,200.00', date: 'Yesterday', type: 'income' },
    { name: 'Grocery Store', amount: '-$87.32', date: '2 days ago', type: 'expense' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your money today</p>
        </div>
        <Avatar className="h-16 w-16 border-2 border-gray-200">
          <AvatarImage src={user?.imageUrl} alt={user?.firstName} />
          <AvatarFallback className="text-xl">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* User Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription className="mt-2">
                {user?.primaryEmailAddress?.emailAddress}
              </CardDescription>
            </div>
            <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account Health</span>
              <span className="font-semibold">Excellent</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs flex items-center ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 hover:bg-gray-50"
                    onClick={() => navigate(action.path)}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <div className="text-left">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${
                      transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                    } p-2 rounded-full`}>
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount}
                  </span>
                </div>
              ))}
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => navigate('/history')}
              >
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
