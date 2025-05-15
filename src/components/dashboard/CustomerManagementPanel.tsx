import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DraggableComponent from "./DraggableComponent";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  policies: number;
  lastContact: string;
  avatar?: string;
}

interface Communication {
  id: string;
  type: "email" | "call" | "message";
  date: string;
  content: string;
  from: string;
}

interface Policy {
  id: string;
  type: string;
  number: string;
  status: "active" | "pending" | "expired";
  premium: string;
  startDate: string;
  endDate: string;
}

const CustomerManagementPanel = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock data for demonstration
  const customers: Customer[] = [
    {
      id: "1",
      name: "Jane Cooper",
      email: "jane.cooper@example.com",
      phone: "(555) 123-4567",
      status: "active",
      policies: 3,
      lastContact: "2023-06-15",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    {
      id: "2",
      name: "Robert Fox",
      email: "robert.fox@example.com",
      phone: "(555) 234-5678",
      status: "pending",
      policies: 1,
      lastContact: "2023-06-10",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
    },
    {
      id: "3",
      name: "Esther Howard",
      email: "esther.howard@example.com",
      phone: "(555) 345-6789",
      status: "active",
      policies: 2,
      lastContact: "2023-06-05",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=esther",
    },
    {
      id: "4",
      name: "Cameron Williamson",
      email: "cameron.williamson@example.com",
      phone: "(555) 456-7890",
      status: "inactive",
      policies: 0,
      lastContact: "2023-05-20",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cameron",
    },
    {
      id: "5",
      name: "Brooklyn Simmons",
      email: "brooklyn.simmons@example.com",
      phone: "(555) 567-8901",
      status: "active",
      policies: 4,
      lastContact: "2023-06-18",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brooklyn",
    },
  ];

  const communications: Communication[] = [
    {
      id: "1",
      type: "email",
      date: "2023-06-15",
      content: "Policy renewal notification sent",
      from: "System",
    },
    {
      id: "2",
      type: "call",
      date: "2023-06-10",
      content: "Discussed policy options and premium changes",
      from: "Agent Smith",
    },
    {
      id: "3",
      type: "message",
      date: "2023-06-05",
      content: "SMS reminder about upcoming payment",
      from: "System",
    },
  ];

  const policies: Policy[] = [
    {
      id: "1",
      type: "Auto Insurance",
      number: "POL-2023-001",
      status: "active",
      premium: "$1,200.00",
      startDate: "2023-01-15",
      endDate: "2024-01-14",
    },
    {
      id: "2",
      type: "Home Insurance",
      number: "POL-2023-002",
      status: "active",
      premium: "$950.00",
      startDate: "2023-02-20",
      endDate: "2024-02-19",
    },
    {
      id: "3",
      type: "Life Insurance",
      number: "POL-2023-003",
      status: "pending",
      premium: "$750.00",
      startDate: "2023-07-01",
      endDate: "2024-06-30",
    },
    {
      id: "4",
      type: "Business Insurance",
      number: "POL-2023-004",
      status: "active",
      premium: "$2,500.00",
      startDate: "2023-03-10",
      endDate: "2024-03-09",
    },
    {
      id: "5",
      type: "Travel Insurance",
      number: "POL-2023-005",
      status: "expired",
      premium: "$350.00",
      startDate: "2023-04-15",
      endDate: "2023-05-15",
    },
  ];

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsProfileOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DraggableComponent
      id="customers"
      title="Customer Management"
      className="w-full"
      withProvider={true}
    >
      <div className="bg-background w-full rounded-xl border shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Customer Management</h2>
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              Add Customer
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search customers by name, email, or policy number"
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filters
              <ChevronDown size={16} />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Policies</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>
                            {customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(customer.status)}
                        variant="outline"
                      >
                        {customer.status.charAt(0).toUpperCase() +
                          customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.policies}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.lastContact}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Mail size={14} /> Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Phone size={14} /> Call
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <MessageSquare size={14} /> Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit size={14} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <Trash2 size={14} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Customer Profile</DialogTitle>
            </DialogHeader>

            {selectedCustomer && (
              <div className="mt-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedCustomer.avatar} />
                    <AvatarFallback>
                      {selectedCustomer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedCustomer.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{selectedCustomer.email}</span>
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Mail size={14} /> Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Phone size={14} /> Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <MessageSquare size={14} /> Message
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Customer Details</TabsTrigger>
                    <TabsTrigger value="communication">
                      Communication History
                    </TabsTrigger>
                    <TabsTrigger value="policies">
                      Policy Information
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Full Name
                            </p>
                            <p>{selectedCustomer.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Email
                            </p>
                            <p>{selectedCustomer.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Phone
                            </p>
                            <p>{selectedCustomer.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Status
                            </p>
                            <Badge
                              className={getStatusColor(
                                selectedCustomer.status,
                              )}
                              variant="outline"
                            >
                              {selectedCustomer.status.charAt(0).toUpperCase() +
                                selectedCustomer.status.slice(1)}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Address
                            </p>
                            <p>123 Main Street, Anytown, USA 12345</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Location
                            </p>
                            <p>
                              {selectedCustomer.location?.name ||
                                "Not assigned"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Customer Since
                            </p>
                            <p>January 15, 2023</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="communication">
                    <Card>
                      <CardHeader>
                        <CardTitle>Communication History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {communications.map((comm) => (
                            <div
                              key={comm.id}
                              className="flex items-start gap-3 p-3 border rounded-md"
                            >
                              <div className="mt-1">
                                {comm.type === "email" && (
                                  <Mail className="text-blue-500" size={18} />
                                )}
                                {comm.type === "call" && (
                                  <Phone className="text-green-500" size={18} />
                                )}
                                {comm.type === "message" && (
                                  <MessageSquare
                                    className="text-purple-500"
                                    size={18}
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">
                                    {comm.type.charAt(0).toUpperCase() +
                                      comm.type.slice(1)}{" "}
                                    from {comm.from}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {comm.date}
                                  </p>
                                </div>
                                <p className="text-sm mt-1">{comm.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="policies">
                    <Card>
                      <CardHeader>
                        <CardTitle>Policy Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Policy Number</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Premium</TableHead>
                              <TableHead>Start Date</TableHead>
                              <TableHead>End Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {policies.map((policy) => (
                              <TableRow key={policy.id}>
                                <TableCell>{policy.type}</TableCell>
                                <TableCell>{policy.number}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={getStatusColor(policy.status)}
                                    variant="outline"
                                  >
                                    {policy.status.charAt(0).toUpperCase() +
                                      policy.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{policy.premium}</TableCell>
                                <TableCell>{policy.startDate}</TableCell>
                                <TableCell>{policy.endDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DraggableComponent>
  );
};

export default CustomerManagementPanel;
