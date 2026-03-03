import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Download,
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  Coffee,
  ShoppingBag,
  Home as HomeIcon,
  Car,
  Utensils,
} from "lucide-react";
import { format } from "date-fns";

function History() {
  const [date, setDate] = React.useState(new Date());

  const historyByMonth = {
    "March 2026": [
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
      },
    ],
    "February 2026": [
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
      },
      {
        id: "TXN008",
        name: "Grocery Store",
        category: "Shopping",
        date: "2026-02-26",
        time: "11:20 AM",
        amount: -156.42,
        status: "completed",
        type: "expense",
        icon: ShoppingBag,
      },
    ],
  };

  const calculateMonthStats = (transactions) => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = Math.abs(
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
    );

    return { income, expenses, net: income - expenses };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Transaction History
          </h1>
          <p className="text-gray-600 mt-1">
            View your complete financial history
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(date, "MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* All Transactions */}
        <TabsContent value="all" className="space-y-6">
          {Object.entries(historyByMonth).map(([month, transactions]) => {
            const stats = calculateMonthStats(transactions);

            return (
              <div key={month} className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{month}</CardTitle>
                        <CardDescription className="text-base">
                          {transactions.length} transactions
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Net Balance</div>
                        <div
                          className={`text-2xl font-bold ${
                            stats.net >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          $
                          {Math.abs(stats.net).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-xs text-gray-600">Income</div>
                          <div className="font-semibold text-green-600">
                            $
                            {stats.income.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <div>
                          <div className="text-xs text-gray-600">Expenses</div>
                          <div className="font-semibold text-red-600">
                            $
                            {stats.expenses.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {transactions.map((transaction) => {
                        const Icon = transaction.icon;
                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`${
                                  transaction.type === "income"
                                    ? "bg-green-50"
                                    : "bg-red-50"
                                } p-3 rounded-lg`}
                              >
                                <Icon
                                  className={`w-5 h-5 ${
                                    transaction.type === "income"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {transaction.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {transaction.category}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    {transaction.date} • {transaction.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-xl font-bold ${
                                  transaction.type === "income"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.amount > 0 ? "+" : ""}$
                                {Math.abs(transaction.amount).toLocaleString(
                                  "en-US",
                                  { minimumFractionDigits: 2 }
                                )}
                              </p>
                              <Badge
                                variant="outline"
                                className="mt-1 text-green-600 border-green-600"
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </TabsContent>

        {/* Income Tab */}
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income History</CardTitle>
              <CardDescription>All your income transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-600">
                Filtered income transactions will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>All your expense transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-600">
                Filtered expense transactions will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Transactions</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Last 2 months</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Average Transaction</CardDescription>
                <CardTitle className="text-3xl">$432.10</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Per transaction</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Most Frequent Category</CardDescription>
                <CardTitle className="text-2xl">Food & Dining</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">25% of expenses</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Your top spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    category: "Food & Dining",
                    amount: 156.1,
                    percentage: 35,
                    color: "bg-blue-500",
                  },
                  {
                    category: "Shopping",
                    amount: 243.74,
                    percentage: 55,
                    color: "bg-purple-500",
                  },
                  {
                    category: "Utilities",
                    amount: 125.5,
                    percentage: 28,
                    color: "bg-orange-500",
                  },
                  {
                    category: "Transportation",
                    amount: 45.0,
                    percentage: 10,
                    color: "bg-green-500",
                  },
                ].map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-gray-600">
                        ${item.amount.toFixed(2)} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default History;
