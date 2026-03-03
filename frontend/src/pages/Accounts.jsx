import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Eye,
  EyeOff,
  MoreVertical,
  Plus
} from 'lucide-react';

function Accounts() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = React.useState(true);

  const accounts = [
    {
      name: 'Checking Account',
      type: 'checking',
      accountNumber: '****4521',
      balance: 12345.67,
      available: 12345.67,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'Active',
    },
    {
      name: 'Savings Account',
      type: 'savings',
      accountNumber: '****7832',
      balance: 45230.89,
      available: 45230.89,
      icon: PiggyBank,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      status: 'Active',
    },
    {
      name: 'Credit Card',
      type: 'credit',
      accountNumber: '****9012',
      balance: 2450.32,
      available: 7549.68,
      limit: 10000,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      status: 'Active',
    },
    {
      name: 'Investment Account',
      type: 'investment',
      accountNumber: '****3456',
      balance: 78900.45,
      available: 78900.45,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      status: 'Active',
    },
  ];

  const totalBalance = accounts
    .filter(acc => acc.type !== 'credit')
    .reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Your Accounts</h1>
          <p className="text-gray-600 mt-1">Manage all your accounts in one place</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Total Balance</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">
            {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
          </div>
          <p className="text-blue-100">Across all accounts</p>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All Accounts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accounts.map((account, index) => {
            const Icon = account.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${account.bgColor} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${account.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{account.name}</CardTitle>
                        <CardDescription className="text-base">{account.accountNumber}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {account.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="text-sm text-gray-600">
                        {account.type === 'credit' ? 'Current Balance' : 'Available Balance'}
                      </p>
                      <p className="text-3xl font-bold">
                        {showBalance 
                          ? `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : '••••••'
                        }
                      </p>
                    </div>
                    {account.type === 'credit' && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Available Credit</p>
                        <p className="text-xl font-semibold text-green-600">
                          {showBalance 
                            ? `$${account.available.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '••••••'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {account.type === 'credit' && account.limit && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Credit Usage</span>
                        <span className="font-semibold">
                          {((account.balance / account.limit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={(account.balance / account.limit) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/transactions')}
                    >
                      View Transactions
                    </Button>
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/transfer')}
                    >
                      Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Monthly Income</CardDescription>
            <CardTitle className="text-2xl">$8,432.90</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">↑ 8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Monthly Spending</CardDescription>
            <CardTitle className="text-2xl">$3,210.45</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">↓ 4.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Net Savings</CardDescription>
            <CardTitle className="text-2xl">$5,222.45</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">↑ 15.8% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Accounts;
