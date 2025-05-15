import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Download,
  Filter,
  PieChart,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [reportType, setReportType] = useState("sales");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Analyze your agency's performance and trends
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
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="sales"
        className="w-full"
        onValueChange={setReportType}
      >
        <TabsList className="grid grid-cols-4 md:w-[600px] mb-6">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Total Revenue"
            value="$124,568"
            change={12.5}
            trend="up"
            icon={<DollarIcon />}
          />
          <MetricCard
            title="New Policies"
            value="87"
            change={8.2}
            trend="up"
            icon={<FileIcon />}
          />
          <MetricCard
            title="Conversion Rate"
            value="24.3%"
            change={-2.4}
            trend="down"
            icon={<ChartIcon />}
          />
        </div>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Revenue Trends</span>
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="View by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <RevenueChart />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ProductSalesChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topAgents.map((agent, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {agent.policies} policies
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        ${agent.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <PolicyDistributionChart />
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Policy Type Breakdown</h3>
                  {policyTypes.map((policy, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: policy.color }}
                        />
                        <span>{policy.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          {policy.count} policies
                        </span>
                        <span className="font-medium">
                          {policy.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <PolicyTrendsChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <CustomerAcquisitionChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <CustomerRetentionChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Age Distribution</h3>
                  <DemographicChart type="age" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <DemographicChart type="location" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Customer Type</h3>
                  <DemographicChart type="type" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <CommissionsChart />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <CommissionByProductChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Commission Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <CommissionProjectionsChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, trend, icon }: MetricCardProps) => {
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

// Placeholder components for charts
const RevenueChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <LineChart className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Revenue Chart Visualization</p>
      </div>
    </div>
  );
};

const ProductSalesChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <PieChart className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Product Sales Chart</p>
      </div>
    </div>
  );
};

const PolicyDistributionChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <PieChart className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Policy Distribution Chart</p>
      </div>
    </div>
  );
};

const PolicyTrendsChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <LineChart className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Policy Trends Chart</p>
      </div>
    </div>
  );
};

const CustomerAcquisitionChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <BarChart3 className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Customer Acquisition Chart</p>
      </div>
    </div>
  );
};

const CustomerRetentionChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <LineChart className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Customer Retention Chart</p>
      </div>
    </div>
  );
};

const DemographicChart = ({ type }: { type: string }) => {
  return (
    <div className="w-full h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <PieChart className="h-8 w-8 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
        </p>
      </div>
    </div>
  );
};

const CommissionsChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <BarChart3 className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Commissions Chart</p>
      </div>
    </div>
  );
};

const CommissionByProductChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <PieChart className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Commission by Product Chart</p>
      </div>
    </div>
  );
};

const CommissionProjectionsChart = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center">
        <LineChart className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Commission Projections Chart</p>
      </div>
    </div>
  );
};

// Mock data
const topAgents = [
  { name: "Sarah Johnson", policies: 42, revenue: 156800 },
  { name: "Michael Chen", policies: 38, revenue: 142500 },
  { name: "David Wilson", policies: 35, revenue: 128900 },
  { name: "Emily Rodriguez", policies: 31, revenue: 115600 },
  { name: "James Taylor", policies: 28, revenue: 104200 },
];

const policyTypes = [
  { name: "Auto Insurance", count: 458, percentage: 42, color: "#3b82f6" },
  { name: "Home Insurance", count: 286, percentage: 26, color: "#10b981" },
  { name: "Life Insurance", count: 164, percentage: 15, color: "#f59e0b" },
  { name: "Business Insurance", count: 98, percentage: 9, color: "#8b5cf6" },
  { name: "Health Insurance", count: 87, percentage: 8, color: "#ec4899" },
];

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

export default ReportsAnalytics;
