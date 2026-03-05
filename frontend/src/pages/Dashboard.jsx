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
import { ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { accountAPI, formatCurrency, formatDate } from "@/services/apiService";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [accounts, setAccounts] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [totalBalance, setTotalBalance] = React.useState(0);
  const [, setError] = React.useState(null);

  // Fetch accounts and transactions
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all accounts
        const accountsResponse = await accountAPI.getUserAccounts(user.id);
        setAccounts(accountsResponse.accounts || []);

        // Fetch user transactions from ledger
        const ledgerResponse = await accountAPI.getUserLedger(user.id);
        const allTransactions = ledgerResponse.ledger || [];
        setTransactions(allTransactions.slice(0, 3)); // Show 3 recent

        // Calculate total balance from all accounts
        let total = 0;
        if (accountsResponse.accounts) {
          for (const account of accountsResponse.accounts) {
            const balanceResponse = await accountAPI.getAccountBalance(
              account._id,
              user.id
            );
            total += parseFloat(balanceResponse.balance.balance || 0);
          }
        }
        setTotalBalance(total);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const stats = [
    {
      title: "Total Balance",
      value: formatCurrency(totalBalance),
      numericValue: totalBalance,
      trend: totalBalance >= 0 ? "up" : "down",
      isMonetary: true,
    },
    {
      title: "Active Accounts",
      value: accounts.filter((a) => a.status === "ACTIVE").length.toString(),
      numericValue: accounts.filter((a) => a.status === "ACTIVE").length,
      trend:
        accounts.filter((a) => a.status === "ACTIVE").length > 0
          ? "up"
          : "down",
      isMonetary: false,
    },
    {
      title: "Recent Transactions",
      value: transactions.length.toString(),
      numericValue: transactions.length,
      trend: transactions.length > 0 ? "up" : "down",
      isMonetary: false,
    },
  ];

  const quickActions = [
    {
      title: "Accounts",
      description: "Manage accounts",
      path: "/accounts",
    },
    {
      title: "Transfer",
      description: "Send money",
      path: "/transfer",
    },
    {
      title: "History",
      description: "View ledger",
      path: "/history",
    },
  ];

  return (
    <div className="min-h-95vh bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your money today
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: stat.isMonetary
                      ? stat.trend === "up"
                        ? "#10b981"
                        : "#ef4444"
                      : "#1f2937",
                  }}
                >
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quick Actions */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 hover:bg-gray-50 border-gray-200"
                    onClick={() => navigate(action.path)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-xs text-gray-500">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest activity</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => {
                    const isCredit = transaction.direction === "CREDIT";
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`${
                              isCredit ? "bg-green-50" : "bg-red-50"
                            } p-2 rounded-full`}
                          >
                            {isCredit ? (
                              <ArrowDownLeft className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {isCredit ? "Received" : "Sent"}{" "}
                              {formatCurrency(Math.abs(transaction.amount))}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default">
                          {isCredit ? "Deposit" : "Withdrawal"}
                        </Badge>
                      </div>
                    );
                  })}
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => navigate("/history")}
                  >
                    View All Transactions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
