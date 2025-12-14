'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Megaphone,
  UserCog,
  Clock,
  ChevronRight,
  Ticket,
  Folder,
  Star,
  X,
  CreditCard,
  Search,
  Phone,
  CarFront
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { AdminRoutes } from '@/lib/constants/routes';
import { useAdminLogout } from '@/api/domains/admin-settings/queries';

const navigationGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: AdminRoutes.DASHBOARD, icon: LayoutDashboard },
      { name: 'Reports', href: AdminRoutes.REPORTS, icon: FileText },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Service Requests', href: AdminRoutes.REQUESTS, icon: Calendar },
      { name: 'Slot Management', href: AdminRoutes.SLOTS, icon: Clock },
      { name: 'Orders', href: AdminRoutes.ORDERS, icon: ShoppingBag },
      { name: 'Payments', href: AdminRoutes.PAYMENTS, icon: CreditCard },
    ]
  },
  {
    title: 'Catalog',
    items: [
      { name: 'Services', href: AdminRoutes.SERVICES, icon: Car },
      { name: 'Products', href: AdminRoutes.PRODUCTS, icon: Package },
      { name: 'Categories', href: AdminRoutes.CATEGORIES, icon: Folder },
      { name: 'Vehicle Types', href: AdminRoutes.VEHICLE_TYPES, icon: CarFront },
    ]
  },
  {
    title: 'Marketing',
    items: [
      { name: 'Posters', href: AdminRoutes.POSTERS, icon: Megaphone },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Staff', href: AdminRoutes.STAFF, icon: UserCog },
      { name: 'Customers', href: AdminRoutes.CUSTOMERS, icon: Users },
    ]
  },
  {
    title: 'Support',
    items: [
      { name: 'Feedback', href: AdminRoutes.FEEDBACK, icon: Star },
      { name: 'Tickets', href: AdminRoutes.TICKETS, icon: Ticket },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: AdminRoutes.SETTINGS, icon: Settings },
      { name: 'Contacts', href: AdminRoutes.CONTACTS, icon: Phone },
    ]
  }
];

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const adminLogout = useAdminLogout();

  const handleLogout = () => {
    // The logout hook handles all cleanup (cookies, token, cache, redirect)
    adminLogout.mutate(undefined);
  };

  // Filter navigation items based on search
  const filteredGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-[280px] sm:w-80 force-sheet-bg border-r-2 border-border shadow-2xl transform transition-all duration-500 ease-in-out lg:hidden',
        sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <span className="text-base sm:text-lg font-bold text-foreground block truncate">
                  Admin Panel
                </span>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Eazy Wash Admin
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation with Custom Scrollbar */}
          <nav className="flex-1 px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto space-y-4 sm:space-y-6 scrollbar-thin">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                <p className="px-2 sm:px-3 mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </p>
                <div className="space-y-0.5 sm:space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all group',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-foreground hover:bg-muted'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {isActive && <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile Logout */}
          <div className="p-3 sm:p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-9 sm:h-10 text-xs sm:text-sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col z-30">
        <div className="flex flex-col flex-1 min-h-0 force-sheet-bg border-r-2 border-border">
          {/* Desktop Header */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-xl font-bold text-foreground">Admin Panel</span>
                <p className="text-xs text-muted-foreground mt-0.5">Eazy Wash Admin</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation with Custom Scrollbar */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-6 scrollbar-thin">
            {filteredGroups.map((group) => (
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
