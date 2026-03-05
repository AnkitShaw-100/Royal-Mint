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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  accountAPI,
  formatCurrency,
  formatDate,
  formatTime,
} from "@/services/apiService";
import { toast } from "sonner";

function History() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [ledgerEntries, setLedgerEntries] = React.useState([]);
  const [filteredEntries, setFilteredEntries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedType, setSelectedType] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 3;

  // Fetch ledger entries
  React.useEffect(() => {
    const fetchLedger = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await accountAPI.getUserLedger(user.id);
        const allEntries = response.ledger || [];
        setLedgerEntries(allEntries);
      } catch (err) {
        console.error("Error fetching ledger:", err);
        setError(err.message);
        toast.error("Failed to load ledger history");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchLedger();
    }
  }, [user?.id]);

  // Filter entries when they change or filters change
  React.useEffect(() => {
    filterEntries(ledgerEntries, selectedType, searchQuery);
  }, [ledgerEntries, selectedType, searchQuery]);

  // Filter ledger entries
  const filterEntries = (entries, type, query) => {
    let filtered = entries;

    if (type !== "ALL") {
      filtered = filtered.filter((e) => e.direction === type);
    }

    if (query) {
      filtered = filtered.filter(
        (e) =>
          e._id?.toLowerCase().includes(query.toLowerCase()) ||
          e.note?.toLowerCase().includes(query.toLowerCase()) ||
          e.transaction?.transactionId?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredEntries(filtered);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    filterEntries(ledgerEntries, type, searchQuery);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterEntries(ledgerEntries, selectedType, query);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

  // Calculate statistics
  const calculateStats = (entries) => {
    let totalDeposits = 0;
    let totalWithdrawals = 0;

    entries.forEach((e) => {
      const amount = parseFloat(e.amount);
      if (e.direction === "CREDIT") {
        totalDeposits += amount;
      } else if (e.direction === "DEBIT") {
        totalWithdrawals += amount;
      }
    });

    return {
      totalDeposits,
      totalWithdrawals,
      net: totalDeposits - totalWithdrawals,
      totalCount: entries.length,
    };
  };

  const stats = calculateStats(filteredEntries);

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
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              History
            </h1>
            <p className="text-gray-600 mt-1">
              Complete record of all deposits and withdrawals
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Statistics Cards */}
        {filteredEntries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-1">
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  Total Deposits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalDeposits)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Money credited</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                  Total Withdrawals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalWithdrawals)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Money debited</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
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
          </div>
        )}

        {/* Filters */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Type</label>
                <Select value={selectedType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Entries</SelectItem>
                    <SelectItem value="CREDIT">Deposits</SelectItem>
                    <SelectItem value="DEBIT">Withdrawals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold">Search</label>
                <Input
                  placeholder="Search by ID or note..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ledger Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading ledger history...</p>
            </div>
          </div>
        ) : filteredEntries.length > 0 ? (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Ledger Entries</CardTitle>
              <CardDescription>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredEntries.length)} of {filteredEntries.length} entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold text-base">Date & Time</TableHead>
                      <TableHead className="font-semibold text-base">Type</TableHead>
                      <TableHead className="font-semibold text-base">Account</TableHead>
                      <TableHead className="font-semibold text-base">Transaction ID</TableHead>
                      <TableHead className="font-semibold text-base">Note</TableHead>
                      <TableHead className="text-right font-semibold text-base">Amount</TableHead>
                      {paginatedEntries.some(e => e.runningBalance !== undefined) && (
                        <TableHead className="text-right font-semibold text-base">Balance</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEntries.map((entry) => {
                      const isDeposit = entry.direction === "CREDIT";

                      return (
                        <TableRow key={entry._id} className="hover:bg-gray-50/70 h-16">
                          <TableCell className="py-3 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900 leading-none text-base">
                                {formatDate(entry.createdAt)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatTime(entry.createdAt)}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <Badge
                              variant="outline"
                              className={`capitalize gap-1.5 text-sm py-1 ${
                                isDeposit
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {isDeposit ? (
                                <>
                                  <ArrowDownLeft className="w-4 h-4" />
                                  Deposit
                                </>
                              ) : (
                                <>
                                  <ArrowUpRight className="w-4 h-4" />
                                  Withdrawal
                                </>
                              )}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-3 text-base font-mono">
                            {entry.account?.account || "N/A"}
                          </TableCell>

                          <TableCell className="py-3 text-base font-mono">
                            {entry.transaction?.transactionId || entry.transaction?._id || "N/A"}
                          </TableCell>

                          <TableCell className="py-3 text-base text-gray-700">
                            {entry.note || "-"}
                          </TableCell>

                          <TableCell className="py-3 text-right">
                            <span
                              className={`font-semibold text-base ${
                                isDeposit ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isDeposit ? "+" : "-"}
                              {formatCurrency(entry.amount)}
                            </span>
                          </TableCell>

                          {entry.runningBalance !== undefined && (
                            <TableCell className="py-3 text-right">
                              <span className="font-semibold text-blue-600 text-base">
                                {formatCurrency(entry.runningBalance)}
                              </span>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {filteredEntries.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-gray-200">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              {error ? (
                <>
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Error Loading Ledger
                  </h3>
                  <p className="text-gray-600">{error}</p>
                </>
              ) : (
                <>
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    No Ledger Entries Found
                  </h3>
                  <p className="text-gray-600">
                    {selectedType !== "ALL" || searchQuery
                      ? "Try adjusting your filters"
                      : "Start making transactions to see ledger entries here"}
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
