import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface Stat {
  name: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.name} className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                {stat.trend && (
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
