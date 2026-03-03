import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Wallet,
  User,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function Transfer() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [transactionId, setTransactionId] = React.useState('');
  const [formData, setFormData] = React.useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    note: '',
  });

  React.useEffect(() => {
    if (step === 4 && !transactionId) {
      setTransactionId(`TXN${Math.random().toString().slice(2, 11)}`);
    }
  }, [step, transactionId]);

  const accounts = [
    { id: '1', name: 'Checking Account', number: '****4521', balance: 12345.67 },
    { id: '2', name: 'Savings Account', number: '****7832', balance: 45230.89 },
  ];

  const recentContacts = [
    { name: 'John Smith', account: '****1234', lastTransfer: '$250.00' },
    { name: 'Sarah Johnson', account: '****5678', lastTransfer: '$100.00' },
    { name: 'Mike Wilson', account: '****9012', lastTransfer: '$500.00' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    // Simulate transaction processing
    setTimeout(() => {
      setStep(4);
    }, 2000);
  };

  const handleReset = () => {
    setFormData({ fromAccount: '', toAccount: '', amount: '', note: '' });
    setTransactionId('');
    setStep(1);
  };

  const selectedAccount = accounts.find(acc => acc.id === formData.fromAccount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Transfer Money</h1>
        <p className="text-gray-600 mt-1">Send money quickly and securely</p>
      </div>

      {/* Progress Steps */}
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
                    step >= s.num 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.num}
                  </div>
                  <span className="text-xs mt-2 font-medium">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Transfer Form */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Details</CardTitle>
                <CardDescription>Enter the transfer information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                  {/* From Account */}
                  <div className="space-y-2">
                    <Label htmlFor="fromAccount">From Account</Label>
                    <Select 
                      value={formData.fromAccount}
                      onValueChange={(value) => setFormData({...formData, fromAccount: value})}
                      required
                    >
                      <SelectTrigger id="fromAccount">
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{account.name} {account.number}</span>
                              <span className="ml-4 text-gray-600">
                                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedAccount && (
                      <p className="text-sm text-gray-600">
                        Available: ${selectedAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>

                  {/* To Account */}
                  <div className="space-y-2">
                    <Label htmlFor="toAccount">To Account Number</Label>
                    <Input
                      id="toAccount"
                      placeholder="Enter recipient account number"
                      value={formData.toAccount}
                      onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Textarea
                      id="note"
                      placeholder="Add a note for this transfer..."
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Continue to Review
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Contacts Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Contacts</CardTitle>
                <CardDescription>Quick transfer to recent recipients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setFormData({...formData, toAccount: contact.account})}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.account}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Transfer</CardTitle>
            <CardDescription>Please verify the details before confirming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From</span>
                <span className="font-semibold">
                  {accounts.find(a => a.id === formData.fromAccount)?.name} {accounts.find(a => a.id === formData.fromAccount)?.number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">To</span>
                <span className="font-semibold">{formData.toAccount}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-gray-600">Amount</span>
                <span className="text-3xl font-bold text-blue-600">
                  ${parseFloat(formData.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {formData.note && (
                <div className="pt-4 border-t">
                  <span className="text-gray-600 block mb-2">Note</span>
                  <p className="text-sm bg-white p-3 rounded border">{formData.note}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Confirm Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Processing */}
      {step === 3 && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Processing Transfer...</h3>
            <p className="text-gray-600">Please wait while we process your transaction</p>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Success */}
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
                <span className="font-bold text-green-600">
                  ${parseFloat(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="text-sm">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/history')}>
                View History
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleReset}>
                Make Another Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Transfer;
