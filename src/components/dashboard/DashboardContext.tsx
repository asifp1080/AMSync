import React, { createContext, useState, useContext, ReactNode } from "react";

type DashboardComponent = {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
};

type DashboardContextType = {
  components: DashboardComponent[];
  updateComponentPosition: (
    id: string,
    position: { x: number; y: number },
  ) => void;
  toggleComponentVisibility: (id: string) => void;
  isCustomizing: boolean;
  setIsCustomizing: (value: boolean) => void;
  saveLayout: () => void;
};

const defaultComponents: DashboardComponent[] = [
  {
    id: "metrics",
    type: "DashboardMetrics",
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
    visible: true,
  },
  {
    id: "customers",
    type: "CustomerManagementPanel",
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
    visible: true,
  },
  {
    id: "renewals",
    type: "RenewalsAndTransactions",
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
    visible: true,
  },
];

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [components, setComponents] = useState<DashboardComponent[]>(() => {
    // Try to load from localStorage
    const savedLayout = localStorage.getItem("dashboardLayout");
    return savedLayout ? JSON.parse(savedLayout) : defaultComponents;
  });

  const [isCustomizing, setIsCustomizing] = useState(false);

  const updateComponentPosition = (
    id: string,
    position: { x: number; y: number },
  ) => {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === id ? { ...component, position } : component,
      ),
    );
  };

  const toggleComponentVisibility = (id: string) => {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === id
          ? { ...component, visible: !component.visible }
          : component,
      ),
    );
  };

  const saveLayout = () => {
    localStorage.setItem("dashboardLayout", JSON.stringify(components));
    setIsCustomizing(false);
  };

  return (
    <DashboardContext.Provider
      value={{
        components,
        updateComponentPosition,
        toggleComponentVisibility,
        isCustomizing,
        setIsCustomizing,
        saveLayout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
