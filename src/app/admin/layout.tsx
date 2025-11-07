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
    <div className="min-h-screen bg-background">
      {!isLoginPage && (
        <>
          {/* Sidebar */}
          <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main content */}
          <div className="lg:pl-80">
            {/* Header */}
            <AdminHeader setSidebarOpen={setSidebarOpen} />

            {/* Page content with custom scrollbar */}
            <main className="py-6 min-h-screen">
              <div className="px-4 sm:px-6 lg:px-8">
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
