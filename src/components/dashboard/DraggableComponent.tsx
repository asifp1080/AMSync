import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDashboard, DashboardProvider } from "./DashboardContext";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DraggableComponentProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  withProvider?: boolean;
}

const DraggableComponentInner: React.FC<
  Omit<DraggableComponentProps, "withProvider">
> = ({ id, children, className = "", title }) => {
  const { isCustomizing, updateComponentPosition } = useDashboard();
  const [isDragging, setIsDragging] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    if (isCustomizing) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (isCustomizing) {
      setIsDragging(false);
      updateComponentPosition(id, { x: info.point.x, y: info.point.y });
    }
  };

  return (
    <motion.div
      ref={componentRef}
      drag={isCustomizing}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`relative ${isDragging ? "z-50" : "z-0"} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`${isCustomizing ? "border-2 border-dashed border-primary" : ""} h-full`}
      >
        {isCustomizing && (
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-md p-1">
            <div className="cursor-move px-2 text-xs text-muted-foreground">
              {title || id}
            </div>
            <div className="h-4 w-4 rounded-full bg-primary cursor-grab" />
          </div>
        )}
        {children}
      </Card>
    </motion.div>
  );
};

const DraggableComponent: React.FC<DraggableComponentProps> = (props) => {
  const { withProvider = false, ...rest } = props;

  if (withProvider) {
    return (
      <DashboardProvider>
        <DraggableComponentInner {...rest} />
      </DashboardProvider>
    );
  }

  return <DraggableComponentInner {...rest} />;
};

export default DraggableComponent;
