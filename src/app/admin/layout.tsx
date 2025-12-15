'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname?.includes('/admin/auth');

  return (
    <div className="h-screen overflow-hidden bg-background">
      {!isLoginPage && (
        <>
          {/* Sidebar */}
          <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main content */}
          <div className="lg:pl-80 h-full flex flex-col">
            {/* Header */}
            <AdminHeader setSidebarOpen={setSidebarOpen} />

            {/* Page content - takes remaining height */}
            <main className="flex-1 overflow-y-auto flex flex-col">
              <div className="px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
                {children}
              </div>
            </main>
          </div>
        </>
      )}
      {isLoginPage && (
        <main className="min-h-screen">
          {children}
        </main>
      )}
    </div>
  );
}
