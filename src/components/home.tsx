import React, { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { useLocation } from "@/lib/location-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { DashboardProvider, useDashboard } from "./dashboard/DashboardContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
  MapPin,
} from "lucide-react";
import Sidebar from "./dashboard/Sidebar";

// Dashboard components
import DashboardMetrics from "./dashboard/DashboardMetrics";
import CustomerManagementPanel from "./dashboard/CustomerManagementPanel";
import RenewalsAndTransactions from "./dashboard/RenewalsAndTransactions";
import ReportsAnalytics from "./dashboard/ReportsAnalytics";
import SettingsPage from "./settings/SettingsPage";
import PolicyLocationManagement from "./dashboard/PolicyLocationManagement";
import ReportingByLocation from "./dashboard/ReportingByLocation";
import EmployeeManagement from "./dashboard/EmployeeManagement";

// Dashboard customize button component
const DashboardCustomizeButton = () => {
  const dashboard = useDashboard();
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => dashboard.setIsCustomizing(!dashboard.isCustomizing)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-settings"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {dashboard.isCustomizing ? "Save Layout" : "Customize Dashboard"}
    </Button>
  );
};

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentLocation, userLocations, setCurrentLocation } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const isDarkMode = theme === "dark";
  const { user, signOut } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-background relative">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-64" : "w-20"} bg-card border-r border-border transition-all duration-300 flex flex-col`}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
        >
          <div className="p-4 border-b border-border flex items-center justify-between h-16 relative">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="flex justify-center items-center"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              {sidebarOpen ? (
                <h1 className="text-xl font-bold">Agency Manager</h1>
              ) : (
                <h1 className="text-xl font-bold">AM</h1>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              {sidebarOpen && "Dashboard"}
            </Button>

            <Button
              variant={activeTab === "customers" ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
              onClick={() => setActiveTab("customers")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {sidebarOpen && "Customers"}
            </Button>

            <Button
              variant={activeTab === "renewals" ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
              onClick={() => setActiveTab("renewals")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              {sidebarOpen && "Renewals"}
            </Button>

            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
              onClick={() => setActiveTab("reports")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              {sidebarOpen && "Reports"}
            </Button>

            <Button
              variant={activeTab === "employees" ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
              onClick={() => setActiveTab("employees")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {sidebarOpen && "Employees"}
            </Button>

            <Button
              variant={activeTab === "policies" ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
              onClick={() => setActiveTab("policies")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
              {sidebarOpen && "Policies"}
            </Button>

            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
              onClick={() => setActiveTab("settings")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-5 w-5"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {sidebarOpen && "Settings"}
            </Button>
          </nav>

          <div className="p-4 border-t border-border">
            {sidebarOpen ? (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            ) : (
              <Avatar className="h-8 w-8 mx-auto">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 ml-0">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center border rounded-md px-3 py-1.5">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">
                  {currentLocation?.name || "Select Location"}
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers, policies, quotes..."
                  className="pl-10 pr-4 py-2 rounded-md border border-input bg-background w-64 focus:outline-none focus:ring-2 focus:ring-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user?.user_metadata?.full_name || user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <DashboardCustomizeButton />
                </div>
                <DashboardMetrics />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CustomerManagementPanel />
                  <RenewalsAndTransactions />
                </div>
              </div>
            )}

            {activeTab === "customer" && <CustomerManagementPanel />}
            {activeTab === "customer-view" && <CustomerManagementPanel />}

            {activeTab === "policy-renewals" && <RenewalsAndTransactions />}

            {activeTab === "report" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <Tabs defaultValue="analytics">
                  <TabsList>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="location">Location Reports</TabsTrigger>
                  </TabsList>
                  <TabsContent value="analytics">
                    <ReportsAnalytics />
                  </TabsContent>
                  <TabsContent value="location">
                    <ReportingByLocation />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "settings-employees" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Employee Management</h1>
                <EmployeeManagement />
              </div>
            )}

            {activeTab === "policy" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">
                  Policy & Location Management
                </h1>
                <PolicyLocationManagement />
              </div>
            )}

            {activeTab === "settings" && <SettingsPage />}

            {/* Handle all other tabs */}
            {activeTab !== "dashboard" &&
              activeTab !== "customer" &&
              activeTab !== "customer-view" &&
              activeTab !== "policy-renewals" &&
              activeTab !== "report" &&
              activeTab !== "settings-employees" &&
              activeTab !== "policy" &&
              activeTab !== "settings" && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold capitalize">
                    {activeTab.split("-").join(" ")}
                  </h1>
                  <div className="p-6 border rounded-lg bg-card">
                    <p>This section is under development.</p>
                  </div>
                </div>
              )}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Home;
