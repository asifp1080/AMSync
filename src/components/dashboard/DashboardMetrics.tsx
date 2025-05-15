import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  BarChart2,
  PieChart,
} from "lucide-react";
import { motion } from "framer-motion";
import DraggableComponent from "./DraggableComponent";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  chartComponent: React.ReactNode;
}

const MetricCard = (
  { title, value, change, icon, chartComponent }: MetricCardProps = {
    title: "Total Customers",
    value: "1,248",
    change: 12.5,
    icon: <Users className="h-5 w-5 text-blue-500" />,
    chartComponent: <div className="h-10 w-full bg-slate-100 rounded-md" />,
  },
) => {
  const isPositive = change >= 0;

  return (
    <Card className="overflow-hidden bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <div className="flex items-center mt-1">
              <span
                className={`flex items-center text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                vs last month
              </span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700">
            {icon}
          </div>
        </div>
        <div className="mt-4">{chartComponent}</div>
      </CardContent>
    </Card>
  );
};

const DashboardMetrics = () => {
  // Sample data for metrics
  const metrics = [
    {
      title: "Total Customers",
      value: "1,248",
      change: 12.5,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      chartComponent: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-10 w-full relative overflow-hidden rounded-md"
        >
          <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
            {[40, 70, 45, 75, 60, 90, 80].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-1 mx-0.5 bg-blue-500/20 rounded-t-sm"
              />
            ))}
          </div>
        </motion.div>
      ),
    },
    {
      title: "Active Policies",
      value: "867",
      change: 8.2,
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
      chartComponent: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-10 w-full relative overflow-hidden rounded-md"
        >
          <div className="absolute bottom-0 left-0 w-full h-full">
            <svg viewBox="0 0 100 20" className="w-full h-full">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
                d="M0,10 L10,8 L20,15 L30,7 L40,12 L50,5 L60,10 L70,8 L80,15 L90,7 L100,10"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
              />
            </svg>
          </div>
        </motion.div>
      ),
    },
    {
      title: "Monthly Revenue",
      value: "$24,568",
      change: 18.3,
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      chartComponent: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-10 w-full relative overflow-hidden rounded-md"
        >
          <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
            {[30, 50, 70, 90, 75, 85, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-1 mx-0.5 bg-green-500/20 rounded-t-sm"
              />
            ))}
          </div>
        </motion.div>
      ),
    },
    {
      title: "Growth Rate",
      value: "14.2%",
      change: -2.4,
      icon: <TrendingUp className="h-5 w-5 text-amber-500" />,
      chartComponent: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-10 w-full relative overflow-hidden rounded-md"
        >
          <div className="absolute bottom-0 left-0 w-full h-full">
            <svg viewBox="0 0 100 20" className="w-full h-full">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
                d="M0,15 L10,13 L20,14 L30,10 L40,12 L50,8 L60,9 L70,5 L80,7 L90,3 L100,5"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
            </svg>
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <DraggableComponent
      id="metrics"
      title="Performance Metrics"
      className="w-full"
      withProvider={true}
    >
      <div className="bg-background p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Performance Metrics</h2>
          <div className="flex items-center space-x-2">
            <select className="text-sm border rounded-md px-2 py-1 bg-background">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard
                title={metric.title}
                value={metric.value}
                change={metric.change}
                icon={metric.icon}
                chartComponent={metric.chartComponent}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </DraggableComponent>
  );
};

export default DashboardMetrics;
