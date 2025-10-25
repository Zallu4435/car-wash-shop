import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPI {
  name: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description?: string;
}

interface DashboardKPIProps {
  kpis: KPI[];
}

export function DashboardKPI({ kpis }: DashboardKPIProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.name} className="border-2 border-border hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${kpi.bgColor} rounded-xl`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                {kpi.change && (
                  <div className="flex items-center gap-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        kpi.trend === 'up' 
                          ? 'text-primary' 
                          : 'text-destructive'
                      }`}
                    >
                      {kpi.change}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{kpi.name}</p>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {kpi.value}
                </p>
                {kpi.description && (
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
