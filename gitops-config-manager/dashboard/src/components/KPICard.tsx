import type { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: number;
  icon: ReactNode;
  accentClass?: string;
  index?: number;
}

export function KPICard({ title, value, icon, accentClass = "text-primary", index = 0 }: KPICardProps) {
  return (
    <div className={`glass-card rounded-lg p-5 animate-fade-in-up stagger-${index + 1} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${accentClass}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-muted/60 ${accentClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
