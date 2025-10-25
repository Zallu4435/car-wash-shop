'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  Package, 
  Users, 
  ShoppingBag, 
  Calendar,
  Settings,
  LogOut,
  FileText,
  Tag,
  Megaphone,
  UserCog,
  Clock,
  Shield,
  ChevronRight,
  Ticket,
  Folder,
  Star,
  X,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';

const navigationGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Reports', href: '/admin/reports', icon: FileText },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Service Requests', href: '/admin/requests', icon: Calendar },
      { name: 'Slot Management', href: '/admin/slots', icon: Clock },
      { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    ]
  },
  {
    title: 'Catalog',
    items: [
      { name: 'Services', href: '/admin/services', icon: Car },
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Categories', href: '/admin/categories', icon: Folder },
    ]
  },
  {
    title: 'Marketing',
    items: [
      { name: 'Banners', href: '/admin/marketing/banners', icon: Megaphone },
      { name: 'Campaigns', href: '/admin/marketing/campaigns', icon: Megaphone },
      { name: 'Posters', href: '/admin/marketing/posters', icon: Megaphone },
      { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Staff', href: '/admin/staff', icon: UserCog },
      { name: 'Customers', href: '/admin/customers', icon: Users },
      { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
    ]
  },
  {
    title: 'Support',
    items: [
      { name: 'Feedback', href: '/admin/feedback', icon: Star },
      { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-xl blur-md opacity-40"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">Admin Panel</span>
                <p className="text-xs text-muted-foreground">CarWash Management</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation with Custom Scrollbar */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-6 scrollbar-thin">
            {navigationGroups.map((group) => (
              <div key={group.title}>
                <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all group',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-foreground hover:bg-muted'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </div>
                        {isActive && <ChevronRight className="h-4 w-4" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile Logout */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col z-30">
        <div className="flex flex-col flex-1 min-h-0 bg-card border-r border-border">
          {/* Desktop Header */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-40"></div>
                <div className="relative p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-xl">
                  <Shield className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">Admin Panel</span>
                <p className="text-xs text-muted-foreground mt-0.5">CarWash Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation with Custom Scrollbar */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-6 scrollbar-thin">
            {navigationGroups.map((group) => (
              <div key={group.title}>
                <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all relative group',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-foreground hover:bg-muted'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </div>
                        {isActive && <ChevronRight className="h-4 w-4 animate-pulse" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Desktop Logout */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
