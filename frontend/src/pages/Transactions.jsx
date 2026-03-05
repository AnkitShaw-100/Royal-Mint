import React, { useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Download,
  ArrowDownLeft,
  Coffee,
  ShoppingBag,
  Home as HomeIcon,
  Car,
  Utensils,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  Landmark,
  ListFilter,
} from "lucide-react";

const statusOptions = ["completed", "pending", "failed"];

const statusStyles = {
  completed: {
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  pending: {
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  },
  failed: {
    className: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
  },
};

const formatAmount = (amount) =>
  `$${Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [transactions, setTransactions] = useState([
    {
      id: "TXN001",
      name: "Starbucks Coffee",
      category: "Food & Dining",
      date: "2026-03-03",
      time: "09:30 AM",
      amount: -4.5,
      status: "completed",
      type: "expense",
      icon: Coffee,
      account: "Checking ****4521",
    },
    {
      id: "TXN002",
      name: "Salary Deposit",
      category: "Income",
      date: "2026-03-02",
      time: "12:00 PM",
      amount: 3200.0,
      status: "completed",
      type: "income",
      icon: ArrowDownLeft,
      account: "Checking ****4521",
    },
    {
      id: "TXN003",
      name: "Amazon Purchase",
      category: "Shopping",
      date: "2026-03-01",
      time: "03:45 PM",
      amount: -87.32,
      status: "completed",
      type: "expense",
      icon: ShoppingBag,
      account: "Credit Card ****9012",
    },
    {
      id: "TXN004",
      name: "Electric Bill",
      category: "Utilities",
      date: "2026-03-01",
      time: "10:15 AM",
      amount: -125.5,
      status: "completed",
      type: "expense",
      icon: HomeIcon,
      account: "Checking ****4521",
    },
    {
      id: "TXN005",
      name: "Restaurant",
      category: "Food & Dining",
      date: "2026-02-28",
      time: "07:30 PM",
      amount: -65.8,
      status: "completed",
      type: "expense",
      icon: Utensils,
      account: "Credit Card ****9012",
    },
    {
      id: "TXN006",
      name: "Gas Station",
      category: "Transportation",
      date: "2026-02-28",
      time: "08:00 AM",
      amount: -45.0,
      status: "completed",
      type: "expense",
      icon: Car,
      account: "Checking ****4521",
    },
    {
      id: "TXN007",
      name: "Freelance Payment",
      category: "Income",
      date: "2026-02-27",
      time: "02:00 PM",
      amount: 850.0,
      status: "completed",
      type: "income",
      icon: ArrowDownLeft,
      account: "Checking ****4521",
    },
    {
      id: "TXN008",
      name: "Grocery Store",
      category: "Shopping",
      date: "2026-02-26",
      time: "11:20 AM",
      amount: -156.42,
      status: "pending",
      type: "expense",
      icon: ShoppingBag,
      account: "Checking ****4521",
    },
  ]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.account.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all-categories" ||
        transaction.category
          .toLowerCase()
          .includes(categoryFilter.toLowerCase());

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = Math.abs(
    transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const pendingCount = transactions.filter(
    (transaction) => transaction.status === "pending"
  ).length;

  const handleStatusUpdate = (transactionId, status) => {
    setTransactions((previous) =>
      previous.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status }
          : transaction
      )
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Transactions
            </h1>
            <p className="text-gray-600">
              Track activity, update statuses, and review account movements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="h-9 px-3 bg-white border-gray-200 text-gray-700"
            >
              {filteredTransactions.length} visible
            </Badge>
            <Button
              variant="outline"
              className="gap-2 bg-white border-gray-200"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardDescription>Total Income</CardDescription>
                <CardTitle className="text-2xl text-emerald-600">
                  {formatAmount(totalIncome)}
                </CardTitle>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {
                  transactions.filter(
                    (transaction) => transaction.type === "income"
                  ).length
                }{" "}
                incoming transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  {formatAmount(totalExpenses)}
                </CardTitle>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <ArrowUpRight className="w-4 h-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {
                  transactions.filter(
                    (transaction) => transaction.type === "expense"
                  ).length
                }{" "}
                outgoing transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardDescription>Net Balance</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  {formatAmount(totalIncome - totalExpenses)}
                </CardTitle>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Wallet className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Based on all listed transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <div>
                <CardDescription>Pending Updates</CardDescription>
                <CardTitle className="text-2xl text-amber-600">
                  {pendingCount}
                </CardTitle>
              </div>
              <div className="p-2 rounded-lg bg-amber-50">
                <ListFilter className="w-4 h-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Requires verification</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, transaction ID, or account"
                  className="pl-10 bg-white border-gray-200"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-47.5 bg-white border-gray-200">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-52.5 bg-white border-gray-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Transaction List</CardTitle>
            <CardDescription>
              Professional view with inline status updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="font-semibold">Transaction</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">Account</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Update</TableHead>
                    <TableHead className="text-right font-semibold">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => {
                      const Icon = transaction.icon;
                      const statusConfig =
                        statusStyles[transaction.status] ||
                        statusStyles.pending;
                      const StatusIcon = statusConfig.icon;

                      return (
                        <TableRow
                          key={transaction.id}
                          className="hover:bg-gray-50/70"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3 min-w-55">
                              <div
                                className={`${
                                  transaction.type === "income"
                                    ? "bg-emerald-50"
                                    : "bg-rose-50"
                                } p-2.5 rounded-lg`}
                              >
                                <Icon
                                  className={`w-4 h-4 ${
                                    transaction.type === "income"
                                      ? "text-emerald-600"
                                      : "text-rose-600"
                                  }`}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <p className="font-medium text-gray-900 leading-none">
                                  {transaction.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {transaction.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-gray-700">
                            {transaction.category}
                          </TableCell>

                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="font-medium text-gray-900 leading-none">
                                {transaction.date}
                              </p>
                              <p className="text-xs text-gray-500">
                                {transaction.time}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="inline-flex items-center gap-2 text-gray-700">
                              <Landmark className="w-3.5 h-3.5 text-gray-400" />
                              <span>{transaction.account}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize gap-1.5 ${statusConfig.className}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {transaction.status}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Select
                              value={transaction.status}
                              onValueChange={(value) =>
                                handleStatusUpdate(transaction.id, value)
                              }
                            >
                              <SelectTrigger className="w-32.5 h-8 text-xs bg-white border-gray-200">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((status) => (
                                  <SelectItem
                                    key={status}
                                    value={status}
                                    className="capitalize"
                                  >
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell className="text-right">
                            <span
                              className={`font-semibold ${
                                transaction.type === "income"
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                              }`}
                            >
                              {transaction.amount > 0 ? "+" : "-"}
                              {formatAmount(transaction.amount)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-28 text-center text-gray-500"
                      >
                        No transactions match your current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Transactions;
