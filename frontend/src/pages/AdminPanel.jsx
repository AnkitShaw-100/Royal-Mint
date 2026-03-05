import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  DollarSign,
  Send,
} from 'lucide-react';
import { userAPI, accountAPI, transactionAPI, formatCurrency } from '@/services/apiService';
import { toast } from 'sonner';

function AdminPanel() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searching, setSearching] = React.useState(false);
  const [userAccounts, setUserAccounts] = React.useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [transactionInProgress, setTransactionInProgress] = React.useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await userAPI.getAllUsers(user.id);
      const users = response.users || [];
      
      // Filter users based on search query (email, name, or clerk ID)
      const filtered = users.filter((u) =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.clerkId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (err) {
      toast.error('Failed to search users: ' + err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = async (selectedUser) => {
    setSelectedUser(selectedUser);
    setSelectedAccount(null);
    setAmount('');
    setDescription('');

    try {
      const response = await accountAPI.getUserAccounts(selectedUser.clerkId);
      setUserAccounts(response.accounts || []);
    } catch (err) {
      toast.error('Failed to load accounts: ' + err.message);
    }
  };

  const handleAddFunds = async () => {
    if (!selectedUser || !selectedAccount || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    setTransactionInProgress(true);
    try {
      // Create transaction to add funds
      const transactionData = {
        fromAccount: 'ADMIN',
        toAccount: selectedAccount,
        amount: parsedAmount,
        description: description || 'Admin Fund Addition',
        type: 'CREDIT',
      };

      const response = await transactionAPI.createTransaction(
        transactionData,
        user.id
      );

      toast.success(
        `Successfully added ${formatCurrency(parsedAmount)} to account`
      );

      // Reset form
      setSelectedUser(null);
      setSelectedAccount(null);
      setAmount('');
      setDescription('');
      setSearchQuery('');
      setSearchResults([]);
      setUserAccounts([]);
      setShowConfirmDialog(false);
    } catch (err) {
      toast.error('Failed to add funds: ' + err.message);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage user accounts and add funds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search User Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Search Users
              </CardTitle>
              <CardDescription>
                Find users by email, name, or Clerk ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Query</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      placeholder="Enter email, name, or user ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={searching}>
                      {searching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      Search
                    </Button>
                  </div>
                </div>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Found {searchResults.length} user(s)
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedUser?._id === result._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleSelectUser(result)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-600 text-white font-bold">
                              {result.firstName?.charAt(0)}{result.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {result.firstName} {result.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{result.email}</p>
                          </div>
                          {selectedUser?._id === result._id && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !searching && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No users found matching your search</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Funds Section */}
          {selectedUser && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <DollarSign className="w-5 h-5" />
                  Add Funds to Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected User Info */}
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-green-600 text-white font-bold">
                        {selectedUser.firstName?.charAt(0)}
                        {selectedUser.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                {/* Account Selection */}
                <div className="space-y-2">
                  <Label htmlFor="account">Select Account</Label>
                  {userAccounts.length > 0 ? (
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger id="account">
                        <SelectValue placeholder="Choose an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {userAccounts.map((account) => (
                          <SelectItem key={account._id} value={account._id}>
                            {account.accountNumber} - {account.type} ({account.status})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-red-800 text-sm">
                      No accounts found for this user
                    </div>
                  )}
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (INR)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="e.g., Promotional bonus, Account credit, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Amount Summary */}
                {amount && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 mb-2">Amount to be added:</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ₹{parseFloat(amount).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!selectedAccount || !amount || transactionInProgress}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {transactionInProgress ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Confirm & Add Funds
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Instructions Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">How to Add Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="flex-shrink-0 font-bold text-blue-600">1.</span>
                <span>Search for a user using email or name</span>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 font-bold text-blue-600">2.</span>
                <span>Click to select the user from results</span>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 font-bold text-blue-600">3.</span>
                <span>Choose the account to add funds to</span>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 font-bold text-blue-600">4.</span>
                <span>Enter the amount and description</span>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 font-bold text-blue-600">5.</span>
                <span>Review and confirm the transaction</span>
              </div>
            </CardContent>
          </Card>

          {/* Admin Info Card */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg">Admin Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-900">
              <p>✓ Only admins can access this panel</p>
              <p>✓ All fund additions are logged</p>
              <p>✓ Transactions are instant</p>
              <p>✓ Users receive notifications</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Fund Addition</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="font-semibold text-gray-900">
                    {selectedUser?.firstName} {selectedUser?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAccount ? (
                      userAccounts.find((a) => a._id === selectedAccount)?.accountNumber
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold text-green-600 text-lg">
                    {formatCurrency(parseFloat(amount))}
                  </p>
                </div>
                <p className="text-sm text-gray-600 pt-2">
                  This action will immediately add the funds to the user's account. This cannot be undone.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAddFunds}
              disabled={transactionInProgress}
              className="bg-green-600 hover:bg-green-700"
            >
              {transactionInProgress ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Add Funds
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminPanel;
