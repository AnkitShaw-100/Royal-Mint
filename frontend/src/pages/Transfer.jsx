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
  ArrowLeft,
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
        const loadedAccounts = response.accounts || [];
        setAccounts(loadedAccounts);

        const firstActiveAccount = loadedAccounts.find((account) => account.status === 'ACTIVE');
        if (firstActiveAccount) {
          setFormData((previous) => ({ ...previous, fromAccount: firstActiveAccount._id }));
        }
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

    if (!fromAccount) {
      setError('Please select a valid source account');
      return;
    }

    if (fromAccount.status !== 'ACTIVE') {
      setError('Source account must be active to transfer');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (fromAccount._id === formData.toAccount) {
      setError('Cannot transfer to the same account');
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
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-5xl mx-auto sm:px-6 md:px-8 md:pb-6 md:pt-0 space-y-5">


        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Transfer Money</h1>
            <p className="text-gray-600">Fast, secure transfer with live validation and clear review.</p>
          </div>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="py-5">
            <div className="grid grid-cols-4 gap-3 items-center">
              {[
                { num: 1, label: 'Details' },
                { num: 2, label: 'Review' },
                { num: 3, label: 'Processing' },
                { num: 4, label: 'Complete' },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.num}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{s.label}</span>
                  <div className={`h-1 w-full rounded-full ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {step === 1 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Transfer Details</CardTitle>
              <CardDescription>Fill the details and verify before submission.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-stretch">
                <form onSubmit={handleContinue} className="space-y-5">
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
                      <SelectTrigger id="fromAccount" className="bg-white border-gray-200">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toAccount">Recipient Account ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <Input
                        id="toAccount"
                        type="text"
                        value={formData.toAccount}
                        onChange={(e) => {
                          setFormData({ ...formData, toAccount: e.target.value });
                          setError(null);
                        }}
                        placeholder="Enter recipient account ID"
                        className="pl-10 font-mono bg-white border-gray-200"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Use the exact recipient account ID to avoid transfer failure.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        className="pl-10 bg-white border-gray-200"
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

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col h-1/2 lg:min-h-[calc(100vh-560px)]">
                  <p className="text-sm font-semibold text-gray-900">Transfer Snapshot</p>
                  <div className="space-y-3 text-sm flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-600">Status</span>
                      <Badge variant="outline" className="bg-white border-gray-200">Draft</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-600">From</span>
                      <span className="font-medium text-right">{selectedAccount?.currency || '---'} Account</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-600">Balance</span>
                      <span className="font-semibold">{formatCurrency(selectedAccount?.balance || 0)}</span>
                    </div>
                    <div className="pt-3 mt-auto border-t border-gray-200 flex items-center justify-between gap-3">
                      <span className="text-gray-600">Amount</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(parseFloat(formData.amount || 0))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Review Transfer</CardTitle>
              <CardDescription>Confirm details before sending funds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
                  <div className="px-4 py-3 text-sm text-gray-600">From Account</div>
                  <div className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">{selectedAccount?.user?.firstName || 'Account'}'s {selectedAccount?.currency} account</div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-200">
                  <div className="px-4 py-3 text-sm text-gray-600">Recipient Account ID</div>
                  <div className="px-4 py-3 text-sm font-semibold text-gray-900 text-right font-mono">{formData.toAccount}</div>
                </div>
                <div className="grid grid-cols-2 bg-blue-50/50">
                  <div className="px-4 py-3 text-sm text-gray-700">Transfer Amount</div>
                  <div className="px-4 py-3 text-2xl font-bold text-blue-600 text-right">{formatCurrency(parseFloat(formData.amount || 0))}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="sm:flex-1" onClick={() => setStep(1)} disabled={loading}>
                  Back
                </Button>
                <Button className="sm:flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={loading}>
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
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="py-14 text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Processing Transfer...</h3>
              <p className="text-gray-600">Please wait while we securely process your transaction.</p>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="border-green-200 shadow-sm">
            <CardContent className="py-14 text-center space-y-5">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="w-14 h-14 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Transfer Successful!</h3>
                <p className="text-gray-600 mt-1">Your transfer has been completed successfully.</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl max-w-lg mx-auto text-left space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Amount Transferred</span>
                  <span className="font-bold text-green-600">{formatCurrency(parseFloat(formData.amount))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Transaction ID</span>
                  <span className="font-mono text-xs text-gray-900">{transactionId}</span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-gray-600 text-sm">Idempotency Key</span>
                  <span className="font-mono text-[11px] text-gray-900 truncate">{idempotencyKey}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/history')}>View History</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleReset}>Make Another Transfer</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Transfer;
