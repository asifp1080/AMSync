import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  handleNavClick: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  handleNavClick,
}) => {
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`${sidebarOpen ? "w-64" : "w-20"} ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed lg:static z-40 h-full bg-card border-r border-border transition-all duration-300 flex flex-col`}
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold">Agency Manager</h1>
        ) : (
          <h1 className="text-xl font-bold">AM</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Dashboard Section */}
        <div className="mb-4">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("dashboard")}
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

          {sidebarOpen && activeTab === "dashboard" && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("dashboard-stats")}
              >
                Quick Stats
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("dashboard-widgets")}
              >
                Customizable Widgets
              </Button>
            </div>
          )}
        </div>

        {/* Quoting Engine Section */}
        <div className="mb-4">
          <Button
            variant={activeTab.startsWith("quote") ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("quote")}
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {sidebarOpen && "Quoting Engine"}
          </Button>

          {sidebarOpen && activeTab.startsWith("quote") && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("quote-new")}
              >
                New Quote
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("quote-saved")}
              >
                Saved Quotes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("quote-history")}
              >
                Quote History
              </Button>
            </div>
          )}
        </div>

        {/* Customer Management Section */}
        <div className="mb-4">
          <Button
            variant={activeTab.startsWith("customer") ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("customer")}
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
            {sidebarOpen && "Customer Management"}
          </Button>

          {sidebarOpen && activeTab.startsWith("customer") && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("customer-view")}
              >
                View Customers
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("customer-add")}
              >
                Add New Customer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("customer-import")}
              >
                Import Customers
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("customer-communication")}
              >
                Communication History
              </Button>
            </div>
          )}
        </div>

        {/* Policy Management Section */}
        <div className="mb-4">
          <Button
            variant={activeTab.startsWith("policy") ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("policy")}
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
            {sidebarOpen && "Policy Management"}
          </Button>

          {sidebarOpen && activeTab.startsWith("policy") && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("policy-view")}
              >
                View Policies
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("policy-create")}
              >
                Create New Policy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("policy-renewals")}
              >
                Policy Renewals
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("policy-documents")}
              >
                Document Management
              </Button>
            </div>
          )}
        </div>

        {/* Transaction Management Section */}
        <div className="mb-4">
          <Button
            variant={activeTab.startsWith("transaction") ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("transaction")}
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {sidebarOpen && "Transaction Management"}
          </Button>

          {sidebarOpen && activeTab.startsWith("transaction") && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("transaction-view")}
              >
                View Transactions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("transaction-add")}
              >
                Add Transaction
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("transaction-reconciliation")}
              >
                Reconciliation
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("transaction-receipts")}
              >
                Receipts & Documents
              </Button>
            </div>
          )}
        </div>

        {/* Reporting & Analytics Section */}
        <div className="mb-4">
          <Button
            variant={activeTab.startsWith("report") ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("report")}
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
            {sidebarOpen && "Reporting & Analytics"}
          </Button>

          {sidebarOpen && activeTab.startsWith("report") && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("report-sales")}
              >
                Sales Reports
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("report-renewals")}
              >
                Renewal Reports
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("report-performance")}
              >
                Employee Performance
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("report-financial")}
              >
                Financial Reports
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("report-custom")}
              >
                Custom Reports
              </Button>
            </div>
          )}
        </div>

        {/* Marketing Section */}
        <div className="mb-4">
          <Button
            variant={activeTab.startsWith("marketing") ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("marketing")}
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
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {sidebarOpen && "Marketing"}
          </Button>

          {sidebarOpen && activeTab.startsWith("marketing") && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("marketing-email")}
              >
                Email Campaigns
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("marketing-sms")}
              >
                SMS Campaigns
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("marketing-analytics")}
              >
                Campaign Analytics
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("marketing-templates")}
              >
                Templates
              </Button>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="mb-4">
          <Button
            variant={activeTab.startsWith("settings") ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("settings")}
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

          {sidebarOpen && activeTab.startsWith("settings") && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-medium"
                onClick={() => handleNavClick("settings-hierarchy")}
              >
                Hierarchy
              </Button>
              <div className="pl-4 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleNavClick("settings-entity")}
                >
                  Entity Management
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleNavClick("settings-organization")}
                >
                  Organization Management
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleNavClick("settings-location")}
                >
                  Location Management
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("settings-employees")}
              >
                Employee Management
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("settings-roles")}
              >
                User Roles & Permissions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("settings-payment")}
              >
                Payment Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("settings-system")}
              >
                System Preferences
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("settings-api")}
              >
                API Integrations
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("settings-security")}
              >
                Security & Compliance
              </Button>
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="mb-4">
          <Button
            variant={activeTab.startsWith("resources") ? "default" : "ghost"}
            className={`w-full justify-start ${!sidebarOpen && "justify-center px-0"}`}
            onClick={() => handleNavClick("resources")}
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            {sidebarOpen && "Resources"}
          </Button>

          {sidebarOpen && activeTab.startsWith("resources") && (
            <div className="pl-6 mt-2 space-y-1 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("resources-help")}
              >
                Help & FAQs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleNavClick("resources-support")}
              >
                Contact Support
              </Button>
            </div>
          )}
        </div>
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
  );
};

export default Sidebar;
