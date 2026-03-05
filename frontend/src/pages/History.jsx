import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Eye,
  ArrowLeft,
} from "lucide-react";
import {
  transactionAPI,
  formatCurrency,
  formatDate,
  formatTime,
} from "@/services/apiService";
import { toast } from "sonner";

function History() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [transactions, setTransactions] = React.useState([]);
  const [filteredTransactions, setFilteredTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch transactions
  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await transactionAPI.getUserTransactions(user.id);
        const allTransactions = response.transactions || [];
        setTransactions(allTransactions);
        filterTransactions(allTransactions, selectedStatus, searchQuery);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message);
        toast.error("Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTransactions();
    }
  }, [searchQuery, selectedStatus, user.id]);

  // Filter transactions
  const filterTransactions = (txns, status, query) => {
    let filtered = txns;

    if (status !== "ALL") {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (query) {
      filtered = filtered.filter(
        (t) =>
          t._id?.toLowerCase().includes(query.toLowerCase()) ||
          t.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    filterTransactions(transactions, status, searchQuery);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterTransactions(transactions, selectedStatus, query);
  };

  // Group transactions by date
  const groupTransactionsByDate = (txns) => {
    const grouped = {};
    txns.forEach((t) => {
      const date = formatDate(t.createdAt);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(t);
    });
    return grouped;
  };

  // Calculate statistics
  const calculateStats = (txns) => {
    let totalIn = 0;
    let totalOut = 0;
    let completedCount = 0;

    txns.forEach((t) => {
      const amount = parseFloat(t.amount);
      if (t.status === "COMPLETED") completedCount++;
      // Simplified - assuming if user is receiving money it's credit
      if (t.toAccount === user.id) {
        totalIn += amount;
      } else {
        totalOut += amount;
      }
    });

    return {
      totalIn,
      totalOut,
      net: totalIn - totalOut,
      completedCount,
      totalCount: txns.length,
    };
  };

  const stats = calculateStats(filteredTransactions);
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="space-y-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Transaction History
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all your transactions
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Statistics Cards */}
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Money In
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalIn)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Total received</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  Money Out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalOut)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Total sent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Net Change</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${stats.net >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(stats.net)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Balance change</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.completedCount}/{stats.totalCount}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Successful transactions
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Transactions</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold">Search</label>
                <Input
                  placeholder="Search by ID or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedTransactions).map(
              ([date, dayTransactions]) => (
                <div key={date} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 px-2">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {dayTransactions.map((transaction) => {
                      const amount = parseFloat(transaction.amount);
                      const isDebit = transaction.fromAccount === user.id;

                      const statusColor = {
                        PENDING: "bg-yellow-100 text-yellow-800",
                        COMPLETED: "bg-green-100 text-green-800",
                        FAILED: "bg-red-100 text-red-800",
                        CANCELLED: "bg-gray-100 text-gray-800",
                      };

                      const statusIcon = {
                        COMPLETED: "✓",
                        PENDING: "⏱",
                        FAILED: "✕",
                        CANCELLED: "—",
                      };

                      return (
                        <Card
                          key={transaction._id}
                          className="cursor-pointer hover:shadow-md transition-all"
                          onClick={() =>
                            navigate(`/transaction/${transaction._id}`)
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div
                                  className={`p-3 rounded-full ${
                                    isDebit ? "bg-red-100" : "bg-green-100"
                                  }`}
                                >
                                  {isDebit ? (
                                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                                  ) : (
                                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                  )}
                                </div>

                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">
                                    {isDebit ? "Sent to " : "Received from "}
                                    {transaction.description || "Account"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-600 font-mono">
                                      ID: {transaction._id?.slice(-8)}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {formatTime(transaction.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right space-y-2">
                                <div
                                  className={`text-lg font-bold ${
                                    isDebit ? "text-red-600" : "text-green-600"
                                  }`}
                                >
                                  {isDebit ? "-" : "+"}
                                  {formatCurrency(amount)}
                                </div>
                                <Badge
                                  className={`${statusColor[transaction.status]}`}
                                >
                                  {statusIcon[transaction.status]}{" "}
                                  {transaction.status}
                                </Badge>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-4"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/transaction/${transaction._id}`);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <Card className="border-2">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              {error ? (
                <>
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Error Loading Transactions
                  </h3>
                  <p className="text-gray-600">{error}</p>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-12 h-12 text-gray-400 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    No Transactions Found
                  </h3>
                  <p className="text-gray-600">
                    {selectedStatus !== "ALL" || searchQuery
                      ? "Try adjusting your filters"
                      : "Start making transactions to see them here"}
                  </p>
                  <Button onClick={() => navigate("/transfer")}>
                    Make Your First Transfer
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default History;
