import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet,
  CreditCard,
  TrendingUp,
  Loader2,
  AlertCircle,
  Copy,
  CheckCircle2,
  ArrowDown,
  Send,
  ArrowLeft
} from 'lucide-react';
import { accountAPI, formatCurrency } from '@/services/apiService';
import { toast } from 'sonner';

function Accounts() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [accounts, setAccounts] = React.useState([]);
  const [accountBalances, setAccountBalances] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [totalBalance, setTotalBalance] = React.useState(0);
  const [copiedAccountId, setCopiedAccountId] = React.useState(null);

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
          } catch {
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

  const handleCopyAccountNumber = (accountNumber, accountId) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccountId(accountId);
    toast.success('Account number copied to clipboard');
    setTimeout(() => setCopiedAccountId(null), 2000);
  };

  const getAccountIcon = (status) => {
    if (status === 'ACTIVE') return Wallet;
    return CreditCard;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Your Accounts</h1>
        <p className="text-gray-600 mt-1">Manage and receive money in your accounts</p>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-linear-to-r from-blue-600 to-indigo-700 text-white border-0">
        <CardHeader>
          <CardTitle className="text-white text-lg">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">
            {formatCurrency(totalBalance)}
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
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4 text-lg">No accounts yet</p>
              <p className="text-sm text-gray-400">Contact admin to create an account</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => {
              const Icon = getAccountIcon(account.status);
              const balance = accountBalances[account._id] || 0;
              const statusColor = account.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 
                                 account.status === 'FROZEN' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                 'bg-red-50 text-red-700 border-red-200';
              
              return (
                <Card key={account._id} className="border-2 hover:shadow-lg transition-all overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="bg-blue-100 p-4 rounded-xl">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl text-gray-900">
                            {account.accountType || 'Savings'} Account
                          </CardTitle>
                          <CardDescription className="text-base">
                            {account.currency} Account • Created on {new Date(account.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={statusColor}>
                        {account.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Balance Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {formatCurrency(balance, account.currency)}
                        </p>
                      </div>
                      
                      {/* Account ID Section */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Wallet className="w-4 h-4" />
                          Account ID
                        </p>
                        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-sm font-mono text-gray-900 flex-1 truncate">
                            {account._id}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyAccountNumber(account._id, account._id)}
                            className="text-right"
                          >
                            {copiedAccountId === account._id ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Receive Money Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <ArrowDown className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900">Receive Money</h4>
                          <p className="text-sm text-blue-800">Share your account number above with others to receive funds. An admin can also add funds directly to this account.</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate('/history')}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View History
                      </Button>
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/transfer')}
                        disabled={account.status !== 'ACTIVE'}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Money
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default Accounts;
