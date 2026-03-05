import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  MapPin,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { transactionAPI, formatCurrency, formatDate, formatTime } from '@/services/apiService';

function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [transaction, setTransaction] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const response = await transactionAPI.getTransactionById(id, user.id);
        setTransaction(response.transaction);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && id) {
      fetchTransaction();
    }
  }, [user?.id, id]);

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 text-red-800">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Transaction Not Found</h3>
                  <p className="text-sm">{error || 'The transaction you are looking for does not exist'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isDebit = transaction.fromAccount?.user?._id?.toString() === user.id || transaction.fromAccount?.user?.toString() === user.id;
  const isCredit = transaction.toAccount?.user?._id?.toString() === user.id || transaction.toAccount?.user?.toString() === user.id;
  const amount = parseFloat(transaction.amount);
  const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Header */}
        <Button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 mb-6 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="font-medium text-gray-700 group-hover:text-gray-900">Back</span>
        </Button>

      {/* Main Transaction Card */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${isDebit ? 'bg-red-100' : 'bg-green-100'}`}>
                {isDebit ? (
                  <ArrowUpRight className={`w-8 h-8 ${isDebit ? 'text-red-600' : 'text-green-600'}`} />
                ) : (
                  <ArrowDownLeft className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {isDebit ? '-' : '+'}{formatCurrency(amount)}
                </h2>
                <p className="text-gray-600 text-sm">
                  {isDebit ? 'Money Sent' : 'Money Received'}
                </p>
              </div>
            </div>
            <Badge className={`text-lg px-4 py-2 ${statusColor[transaction.status]}`}>
              {getStatusIcon(transaction.status)}
              <span className="ml-2">{transaction.status}</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Transaction Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Transaction Details</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Transaction ID</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-mono flex-1 break-all">{transaction._id}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyId(transaction._id)}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Date & Time
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {formatDate(transaction.createdAt)}
                  </p>
                  <p className="text-xs text-gray-600 px-1">
                    {formatTime(transaction.createdAt)}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Currency</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
                    {transaction.currency || 'INR'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Info Box */}
          <div>
            {transaction.status === 'COMPLETED' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 text-sm">Transaction Completed</h4>
                    <p className="text-xs text-green-800 mt-1">
                      This transaction has been successfully processed and both parties have been notified.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {transaction.status === 'PENDING' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 text-sm">Transaction Pending</h4>
                    <p className="text-xs text-yellow-800 mt-1">
                      This transaction is being processed. Please check back shortly for updates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {transaction.status === 'FAILED' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm">Transaction Failed</h4>
                    <p className="text-xs text-red-800 mt-1">
                      This transaction could not be completed. Please contact support for more information.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
            {transaction.status === 'PENDING' && (
              <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                <AlertCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default TransactionDetail;
