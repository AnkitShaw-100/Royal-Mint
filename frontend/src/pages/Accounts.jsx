import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
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
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { accountAPI, formatCurrency } from '@/services/apiService';

function Accounts() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showBalance, setShowBalance] = React.useState(true);
  const [accounts, setAccounts] = React.useState([]);
  const [accountBalances, setAccountBalances] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [totalBalance, setTotalBalance] = React.useState(0);

  // Fetch accounts and balances
  React.useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await accountAPI.getUserAccounts(user.id);
        const userAccounts = response.accounts || [];
        setAccounts(userAccounts);

        // Fetch balance for each account
        let total = 0;
        const balances = {};
        for (const account of userAccounts) {
          try {
            const balanceResponse = await accountAPI.getAccountBalance(account._id, user.id);
            balances[account._id] = parseFloat(balanceResponse.balance.balance);
            total += parseFloat(balanceResponse.balance.balance);
          } catch (err) {
            balances[account._id] = 0;
          }
        }
        setAccountBalances(balances);
        setTotalBalance(total);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchAccounts();
    }
  }, [user?.id]);

  const handleCreateAccount = async () => {
    try {
      await accountAPI.createAccount({
        currency: 'INR',
        status: 'ACTIVE'
      }, user.id);
      // Refresh accounts
      const response = await accountAPI.getUserAccounts(user.id);
      setAccounts(response.accounts || []);
    } catch (err) {
      alert('Error creating account: ' + err.message);
    }
  };

  const getAccountIcon = (status) => {
    if (status === 'ACTIVE') return Wallet;
    return CreditCard;
  };

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Your Accounts</h1>
          <p className="text-gray-600 mt-1">Manage all your accounts in one place</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleCreateAccount}
          disabled={loading}
        >
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
            {showBalance ? formatCurrency(totalBalance) : '••••••••'}
          </div>
          <p className="text-blue-100">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All Accounts</h2>
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              {error}
            </CardContent>
          </Card>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : accounts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">No accounts yet</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateAccount}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.map((account) => {
              const Icon = getAccountIcon(account.status);
              const balance = accountBalances[account._id] || 0;
              const statusColor = account.status === 'ACTIVE' ? 'text-green-600 border-green-600' : 
                                 account.status === 'FROZEN' ? 'text-yellow-600 border-yellow-600' : 
                                 'text-red-600 border-red-600';
              
              return (
                <Card key={account._id} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">
                            {account.user?.firstName || 'Account'}'s {account.currency} Account
                          </CardTitle>
                          <CardDescription className="text-base">
                            ID: {account._id.slice(-4).toUpperCase()}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusColor}>
                          {account.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <p className="text-sm text-gray-600">Current Balance</p>
                        <p className="text-3xl font-bold">
                          {showBalance ? formatCurrency(balance, account.currency) : '••••••'}
                        </p>
                      </div>
                    </div>

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
                        disabled={account.status !== 'ACTIVE'}
                      >
                        Transfer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
}

export default Accounts;
