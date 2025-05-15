import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "@/lib/location-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Download, Filter } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
}

interface LocationMetrics {
  totalCustomers: number;
  activePolicies: number;
  monthlyRevenue: number;
  growthRate: number;
}

export default function ReportingByLocation() {
  const { userLocations, currentLocation, setCurrentLocation } = useLocation();
  const [dateRange, setDateRange] = useState("30days");
  const [metrics, setMetrics] = useState<LocationMetrics>({
    totalCustomers: 0,
    activePolicies: 0,
    monthlyRevenue: 0,
    growthRate: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLocation) {
      fetchLocationMetrics(currentLocation.id);
    }
  }, [currentLocation, dateRange]);

  const fetchLocationMetrics = async (locationId: string) => {
    setIsLoading(true);
    try {
      // In a real application, you would fetch actual metrics from your database
      // For this example, we'll simulate the data

      // Fetch customer count for this location
      const { count: customerCount, error: customerError } = await supabase
        .from("customers")
        .select("*", { count: "exact" })
        .eq("location_id", locationId);

      if (customerError) throw customerError;

      // Fetch active policies for this location
      const { count: policyCount, error: policyError } = await supabase
        .from("policies")
        .select("*", { count: "exact" })
        .eq("location_id", locationId)
        .eq("status", "active");

      if (policyError) throw policyError;

      // Fetch transactions for this location to calculate revenue
      const { data: transactions, error: transactionError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("location_id", locationId)
        .gte("date", getDateRangeStart());

      if (transactionError) throw transactionError;

      const totalRevenue =
        transactions?.reduce(
          (sum, transaction) => sum + transaction.amount,
          0,
        ) || 0;

      // Set the metrics
      setMetrics({
        totalCustomers: customerCount || 0,
        activePolicies: policyCount || 0,
        monthlyRevenue: totalRevenue,
        growthRate: generateRandomGrowth(), // In a real app, calculate this from historical data
      });
    } catch (error) {
      console.error("Error fetching location metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRangeStart = () => {
    const now = new Date();
    switch (dateRange) {
      case "7days":
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case "30days":
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case "90days":
        return new Date(now.setDate(now.getDate() - 90)).toISOString();
      case "year":
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
    }
  };

  // Helper function to generate random growth rate for demo purposes
  const generateRandomGrowth = () => {
    return Math.round((Math.random() * 30 - 10) * 10) / 10; // Between -10% and +20%
  };

  const handleLocationChange = (locationId: string) => {
    const location = userLocations.find((loc) => loc.id === locationId);
    if (location) {
      setCurrentLocation(location);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const MetricCard = ({
    title,
    value,
    change,
    trend,
    icon,
  }: MetricCardProps) => {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
          </div>
          <div className="flex items-center mt-4">
            {trend === "up" ? (
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}
            >
              {change}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs. previous period
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Icon components
  const DollarIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );

  const FileIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );

  const UsersIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const ChartIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Location Performance</h2>
          <p className="text-muted-foreground">
            View metrics and analytics for specific locations
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-muted-foreground">
          Select a location to view its performance metrics
        </p>
        <Select
          value={currentLocation?.id || ""}
          onValueChange={handleLocationChange}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {userLocations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name} ({location.entity_name} &gt;{" "}
                {location.region_name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentLocation ? (
        <>
          <Card className="p-6 border-primary/20 bg-primary/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold">{currentLocation.name}</h3>
                <p className="text-muted-foreground">
                  {currentLocation.entity_name} &gt;{" "}
                  {currentLocation.region_name}
                </p>
              </div>
              <div className="text-sm">
                {currentLocation.address && (
                  <p>
                    {currentLocation.address}, {currentLocation.city},{" "}
                    {currentLocation.state} {currentLocation.zip_code}
                  </p>
                )}
                {currentLocation.phone && <p>Phone: {currentLocation.phone}</p>}
                {currentLocation.email && <p>Email: {currentLocation.email}</p>}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Customers"
              value={metrics.totalCustomers.toString()}
              change={8.5}
              trend="up"
              icon={<UsersIcon />}
            />
            <MetricCard
              title="Active Policies"
              value={metrics.activePolicies.toString()}
              change={12.3}
              trend="up"
              icon={<FileIcon />}
            />
            <MetricCard
              title="Monthly Revenue"
              value={formatCurrency(metrics.monthlyRevenue)}
              change={15.8}
              trend="up"
              icon={<DollarIcon />}
            />
            <MetricCard
              title="Growth Rate"
              value={`${metrics.growthRate}%`}
              change={metrics.growthRate > 0 ? 2.4 : -2.4}
              trend={metrics.growthRate > 0 ? "up" : "down"}
              icon={<ChartIcon />}
            />
          </div>

          <Tabs defaultValue="customers" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="customers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/20">
                  <p className="text-muted-foreground">
                    Customer distribution chart will be displayed here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/20">
                  <p className="text-muted-foreground">
                    Policy distribution chart will be displayed here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/20">
                  <p className="text-muted-foreground">
                    Transaction history chart will be displayed here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="p-6 flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">
              Please select a location to view performance metrics
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
