import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Coffee,
  ShoppingBag,
  Home as HomeIcon,
  Car,
  Utensils,
  ArrowLeft
} from 'lucide-react';

function Transactions() {
  const navigate = useNavigate();

  const transactions = [
    {
      id: 'TXN001',
      name: 'Starbucks Coffee',
      category: 'Food & Dining',
      date: '2026-03-03',
      time: '09:30 AM',
      amount: -4.50,
      status: 'completed',
      type: 'expense',
      icon: Coffee,
      account: 'Checking ****4521',
    },
    {
      id: 'TXN002',
      name: 'Salary Deposit',
      category: 'Income',
      date: '2026-03-02',
      time: '12:00 PM',
      amount: 3200.00,
      status: 'completed',
      type: 'income',
      icon: ArrowDownLeft,
      account: 'Checking ****4521',
    },
    {
      id: 'TXN003',
      name: 'Amazon Purchase',
      category: 'Shopping',
      date: '2026-03-01',
      time: '03:45 PM',
      amount: -87.32,
      status: 'completed',
      type: 'expense',
      icon: ShoppingBag,
      account: 'Credit Card ****9012',
    },
    {
      id: 'TXN004',
      name: 'Electric Bill',
      category: 'Utilities',
      date: '2026-03-01',
      time: '10:15 AM',
      amount: -125.50,
      status: 'completed',
      type: 'expense',
      icon: HomeIcon,
      account: 'Checking ****4521',
    },
    {
      id: 'TXN005',
      name: 'Restaurant',
      category: 'Food & Dining',
      date: '2026-02-28',
      time: '07:30 PM',
      amount: -65.80,
      status: 'completed',
      type: 'expense',
      icon: Utensils,
      account: 'Credit Card ****9012',
    },
    {
      id: 'TXN006',
      name: 'Gas Station',
      category: 'Transportation',
      date: '2026-02-28',
      time: '08:00 AM',
      amount: -45.00,
      status: 'completed',
      type: 'expense',
      icon: Car,
      account: 'Checking ****4521',
    },
    {
      id: 'TXN007',
      name: 'Freelance Payment',
      category: 'Income',
      date: '2026-02-27',
      time: '02:00 PM',
      amount: 850.00,
      status: 'completed',
      type: 'income',
      icon: ArrowDownLeft,
      account: 'Checking ****4521',
    },
    {
      id: 'TXN008',
      name: 'Grocery Store',
      category: 'Shopping',
      date: '2026-02-26',
      time: '11:20 AM',
      amount: -156.42,
      status: 'pending',
      type: 'expense',
      icon: ShoppingBag,
      account: 'Checking ****4521',
    },
  ];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">View and manage all your transactions</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{transactions.filter(t => t.type === 'income').length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{transactions.filter(t => t.type === 'expense').length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Net Balance</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              ${(totalIncome - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{transactions.length} total transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-categories">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="transport">Transportation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A list of your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const Icon = transaction.icon;
                return (
                  <TableRow key={transaction.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`${
                          transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                        } p-2 rounded-lg`}>
                          <Icon className={`w-4 h-4 ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.name}</p>
                          <p className="text-sm text-gray-500">{transaction.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{transaction.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.date}</p>
                        <p className="text-sm text-gray-500">{transaction.time}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{transaction.account}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={transaction.status === 'completed' 
                          ? 'text-green-600 border-green-600' 
                          : 'text-yellow-600 border-yellow-600'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}
                        ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

export default Transactions;
