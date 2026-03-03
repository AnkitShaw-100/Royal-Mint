import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Wallet,
  User,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { accountAPI, transactionAPI, generateIdempotencyKey, formatCurrency } from '@/services/apiService';

function Transfer() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [step, setStep] = React.useState(1);
  const [transactionId, setTransactionId] = React.useState('');
  const [accounts, setAccounts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [formData, setFormData] = React.useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
  });
  const [idempotencyKey, setIdempotencyKey] = React.useState('');

  React.useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountAPI.getUserAccounts(user.id);
        setAccounts(response.accounts || []);
      } catch (err) {
        setError('Failed to load accounts: ' + err.message);
      }
    };

    if (user?.id) {
      fetchAccounts();
    }
  }, [user?.id]);

  const handleContinue = (e) => {
    e.preventDefault();

    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    const fromAccount = accounts.find(a => a._id === formData.fromAccount);
    const toAccount = accounts.find(a => a._id === formData.toAccount);

    if (!fromAccount || !toAccount) {
      setError('Please select valid accounts');
      return;
    }

    if (fromAccount.status !== 'ACTIVE' || toAccount.status !== 'ACTIVE') {
      setError('Both accounts must be active to transfer');
      return;
    }

    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const key = generateIdempotencyKey();
      setIdempotencyKey(key);

      const transactionData = {
        fromAccount: formData.fromAccount,
        toAccount: formData.toAccount,
        amount: parseFloat(formData.amount),
        idempotencyKey: key,
      };

      const response = await transactionAPI.createTransaction(transactionData, user.id);

      setTransactionId(response.transaction._id);
      setStep(3);

      setTimeout(() => {
        setStep(4);
      }, 1200);
    } catch (err) {
      setError(err.message);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ fromAccount: '', toAccount: '', amount: '' });
    setTransactionId('');
    setIdempotencyKey('');
    setStep(1);
    setError(null);
  };

  const selectedAccount = accounts.find(acc => acc._id === formData.fromAccount);
  const selectedToAccount = accounts.find(acc => acc._id === formData.toAccount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Transfer Money</h1>
        <p className="text-gray-600 mt-1">Send money quickly and securely</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Details' },
              { num: 2, label: 'Review' },
              { num: 3, label: 'Processing' },
              { num: 4, label: 'Complete' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.num}
                  </div>
                  <span className="text-xs mt-2 font-medium">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <CardDescription>Enter the transfer information</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            <form onSubmit={handleContinue} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fromAccount">From Account</Label>
                <Select
                  value={formData.fromAccount}
                  onValueChange={(value) => {
                    setFormData({ ...formData, fromAccount: value });
                    setError(null);
                  }}
                  required
                >
                  <SelectTrigger id="fromAccount">
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.filter(a => a.status === 'ACTIVE').map((account) => (
                      <SelectItem key={account._id} value={account._id}>
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4" />
                          {account.user?.firstName || 'Account'}'s {account.currency} account
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedAccount && (
                  <p className="text-sm text-gray-600">
                    Status: <Badge variant="outline" className="ml-1">{selectedAccount.status}</Badge>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toAccount">To Account</Label>
                <Select
                  value={formData.toAccount}
                  onValueChange={(value) => {
                    setFormData({ ...formData, toAccount: value });
                    setError(null);
                  }}
                  required
                >
                  <SelectTrigger id="toAccount">
                    <SelectValue placeholder="Select recipient account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.filter(a => a.status === 'ACTIVE' && a._id !== formData.fromAccount).map((account) => (
                      <SelectItem key={account._id} value={account._id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {account.user?.firstName || 'Account'}'s {account.currency} account
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!formData.fromAccount || !formData.toAccount || !formData.amount || loading}
              >
                Continue to Review
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Transfer</CardTitle>
            <CardDescription>Please verify the details before confirming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From</span>
                <span className="font-semibold">{selectedAccount?.user?.firstName || 'Account'}'s {selectedAccount?.currency} account</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">To</span>
                <span className="font-semibold">{selectedToAccount?.user?.firstName || 'Account'}'s {selectedToAccount?.currency} account</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-gray-600">Amount</span>
                <span className="text-3xl font-bold text-blue-600">{formatCurrency(parseFloat(formData.amount || 0))}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={loading}>
                Back
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : 'Confirm Transfer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="flex justify-center mb-6">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Processing Transfer...</h3>
            <p className="text-gray-600">Please wait while we process your transaction</p>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="border-green-200">
          <CardContent className="py-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Transfer Successful!</h3>
            <p className="text-gray-600 mb-6">Your transfer has been completed successfully</p>

            <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto mb-6 text-left">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Amount Transferred</span>
                <span className="font-bold text-green-600">{formatCurrency(parseFloat(formData.amount))}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Key</span>
                <span className="font-mono text-xs truncate">{idempotencyKey}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/history')}>View History</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleReset}>Make Another Transfer</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Transfer;
