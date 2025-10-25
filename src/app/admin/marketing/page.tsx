'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Megaphone,
  FileImage,
  ArrowRight,
  TrendingUp,
  Eye,
  MousePointer
} from 'lucide-react';

export default function MarketingHomePage() {
  const router = useRouter();

  const marketingSections = [
    {
      title: 'Banners',
      description: 'Manage promotional banners and ads',
      icon: Image,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950/30',
      count: 3,
      active: 2,
      href: '/admin/marketing/banners',
    },
    {
      title: 'Campaigns',
      description: 'Create and manage marketing campaigns',
      icon: Megaphone,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950/30',
      count: 2,
      active: 1,
      href: '/admin/marketing/campaigns',
    },
    {
      title: 'Posters',
      description: 'Upload and display promotional posters',
      icon: FileImage,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950/30',
      count: 2,
      active: 2,
      href: '/admin/marketing/posters',
    },
  ];

  const stats = [
    {
      title: 'Total Impressions',
      value: '49K',
      change: '+12.5%',
      icon: Eye,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950/30',
    },
    {
      title: 'Total Clicks',
      value: '2.7K',
      change: '+8.3%',
      icon: MousePointer,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950/30',
    },
    {
      title: 'Avg. CTR',
      value: '5.49%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-950/30',
    },
  ];

  const topPerformers = [
    { title: 'Premium Wash - 20% Off', type: 'Banner', ctr: '5.85%', clicks: 892 },
    { title: 'Summer Special Offer', type: 'Banner', ctr: '6.10%', clicks: 1567 },
    { title: 'Diwali Sale 2025', type: 'Campaign', ctr: '4.89%', clicks: 456 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Marketing</h1>
        <p className="text-muted-foreground mt-1">Manage your marketing campaigns and promotional content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <Badge className="mb-1 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketingSections.map((section) => (
          <Card 
            key={section.title} 
            className="border-2 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
            onClick={() => router.push(section.href)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 ${section.bgColor} rounded-xl`}>
                  <section.icon className={`h-8 w-8 ${section.color}`} />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{section.count}</p>
                  <p className="text-xs text-muted-foreground">Total items</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {section.active} active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performers */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Top Performers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((item, index) => (
              <div key={item.title} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <Badge variant="outline" className="text-xs mt-1">{item.type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{item.ctr}</p>
                  <p className="text-xs text-muted-foreground">{item.clicks} clicks</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
