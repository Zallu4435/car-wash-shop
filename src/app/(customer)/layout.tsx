'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/shared/layout/Header';
import Footer from '@/components/shared/layout/Footer';

export default function CustomerLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Hide footer on auth pages (login includes OTP step)
  const hideFooter = pathname?.startsWith('/auth/login') || 
                     pathname?.startsWith('/auth/register');

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header - Sticky at top with glassmorphism effect */}
      <Header />
      
      {/* Main Content Area with proper spacing and fade-in animation */}
      <main className="flex-1 w-full animate-fade-in">
        <div className="w-full">
          {children}
        </div>
      </main>
      
      {/* Footer - Hidden on auth pages */}
      {!hideFooter && <Footer />}
    </div>
  );
}
