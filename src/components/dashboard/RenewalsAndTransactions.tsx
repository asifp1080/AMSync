import React, { useState } from "react";
import DraggableComponent from "./DraggableComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar, Clock, Download, Filter, Search } from "lucide-react";

interface Renewal {
  id: string;
  policyNumber: string;
  customerName: string;
  policyType: string;
  renewalDate: string;
  premium: number;
  status: "pending" | "processed" | "at risk";
}

interface Transaction {
  id: string;
  transactionId: string;
  customerName: string;
  type: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

const RenewalsAndTransactions = () => {
  const [activeTab, setActiveTab] = useState("renewals");
  const [renewalsFilter, setRenewalsFilter] = useState("all");
  const [transactionsFilter, setTransactionsFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for renewals
  const renewals: Renewal[] = [
    {
      id: "1",
      policyNumber: "POL-12345",
      customerName: "John Smith",
      policyType: "Auto Insurance",
      renewalDate: "2023-06-15",
      premium: 1250.0,
      status: "pending",
    },
    {
      id: "2",
      policyNumber: "POL-23456",
      customerName: "Sarah Johnson",
      policyType: "Home Insurance",
      renewalDate: "2023-06-18",
      premium: 950.0,
      status: "at risk",
    },
    {
      id: "3",
      policyNumber: "POL-34567",
      customerName: "Michael Brown",
      policyType: "Life Insurance",
      renewalDate: "2023-06-22",
      premium: 2100.0,
      status: "processed",
    },
    {
      id: "4",
      policyNumber: "POL-45678",
      customerName: "Emily Davis",
      policyType: "Auto Insurance",
      renewalDate: "2023-06-25",
      premium: 1450.0,
      status: "pending",
    },
    {
      id: "5",
      policyNumber: "POL-56789",
      customerName: "Robert Wilson",
      policyType: "Business Insurance",
      renewalDate: "2023-06-30",
      premium: 3200.0,
      status: "pending",
    },
  ];

  // Mock data for transactions
  const transactions: Transaction[] = [
    {
      id: "1",
      transactionId: "TRX-78901",
      customerName: "John Smith",
      type: "Payment",
      date: "2023-06-10",
      amount: 1250.0,
      status: "completed",
    },
    {
      id: "2",
      transactionId: "TRX-89012",
      customerName: "Sarah Johnson",
      type: "Refund",
      date: "2023-06-11",
      amount: 350.0,
      status: "pending",
    },
    {
      id: "3",
      transactionId: "TRX-90123",
      customerName: "Michael Brown",
      type: "Payment",
      date: "2023-06-12",
      amount: 2100.0,
      status: "completed",
    },
    {
      id: "4",
      transactionId: "TRX-01234",
      customerName: "Emily Davis",
      type: "Payment",
      date: "2023-06-13",
      amount: 1450.0,
      status: "failed",
    },
    {
      id: "5",
      transactionId: "TRX-12345",
      customerName: "Robert Wilson",
      type: "Payment",
      date: "2023-06-14",
      amount: 3200.0,
      status: "completed",
    },
    {
      id: "6",
      transactionId: "TRX-23456",
      customerName: "Jane Cooper",
      type: "Payment",
      date: "2023-06-15",
      amount: 1100.0,
      status: "completed",
    },
    {
      id: "7",
      transactionId: "TRX-34567",
      customerName: "Leslie Alexander",
      type: "Refund",
      date: "2023-06-16",
      amount: 275.0,
      status: "pending",
    },
    {
      id: "8",
      transactionId: "TRX-45678",
      customerName: "Dianne Russell",
      type: "Payment",
      date: "2023-06-17",
      amount: 1800.0,
      status: "completed",
    },
    {
      id: "9",
      transactionId: "TRX-56789",
      customerName: "Guy Hawkins",
      type: "Payment",
      date: "2023-06-18",
      amount: 2800.0,
      status: "failed",
    },
    {
      id: "10",
      transactionId: "TRX-67890",
      customerName: "Brooklyn Simmons",
      type: "Payment",
      date: "2023-06-19",
      amount: 450.0,
      status: "completed",
    },
    {
      id: "11",
      transactionId: "TRX-78901",
      customerName: "Cameron Williamson",
      type: "Adjustment",
      date: "2023-06-20",
      amount: 150.0,
      status: "completed",
    },
    {
      id: "12",
      transactionId: "TRX-89012",
      customerName: "Esther Howard",
      type: "Payment",
      date: "2023-06-21",
      amount: 950.0,
      status: "pending",
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processed":
        return "bg-green-100 text-green-800 border-green-200";
      case "at risk":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const filteredRenewals = renewals.filter((renewal) => {
    const matchesFilter =
      renewalsFilter === "all" || renewal.status === renewalsFilter;
    const matchesSearch =
      renewal.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      renewal.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      transactionsFilter === "all" || transaction.status === transactionsFilter;
    const matchesSearch =
      transaction.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.transactionId
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DraggableComponent
      id="renewals"
      title="Renewals & Transactions"
      withProvider={true}
    >
      <div className="bg-background w-full">
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl font-semibold">
                Renewals & Transactions
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="renewals"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <TabsList className="mb-2 sm:mb-0">
                  <TabsTrigger value="renewals">Upcoming Renewals</TabsTrigger>
                  <TabsTrigger value="transactions">
                    Recent Transactions
                  </TabsTrigger>
                </TabsList>

                <div className="flex w-full sm:w-auto items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={
                      activeTab === "renewals"
                        ? renewalsFilter
                        : transactionsFilter
                    }
                    onValueChange={
                      activeTab === "renewals"
                        ? setRenewalsFilter
                        : setTransactionsFilter
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {activeTab === "renewals" ? (
                        <>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processed">Processed</SelectItem>
                          <SelectItem value="at risk">At Risk</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="renewals" className="mt-0">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Policy Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Policy Type</TableHead>
                        <TableHead className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Renewal Date</span>
                          </div>
                        </TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRenewals.length > 0 ? (
                        filteredRenewals.map((renewal) => (
                          <TableRow
                            key={renewal.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {renewal.policyNumber}
                            </TableCell>
                            <TableCell>{renewal.customerName}</TableCell>
                            <TableCell>{renewal.policyType}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(renewal.renewalDate)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(renewal.premium)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusBadgeColor(renewal.status)} border`}
                              >
                                {renewal.status.charAt(0).toUpperCase() +
                                  renewal.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No renewals found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="mt-0">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Date</span>
                          </div>
                        </TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow
                            key={transaction.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {transaction.transactionId}
                            </TableCell>
                            <TableCell>{transaction.customerName}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(transaction.date)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusBadgeColor(transaction.status)} border`}
                              >
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No transactions found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </DraggableComponent>
  );
};

export default RenewalsAndTransactions;
