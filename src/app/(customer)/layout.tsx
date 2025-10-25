'use client';

import Header from '@/components/shared/layout/Header';
import Footer from '@/components/shared/layout/Footer';

export default function CustomerLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
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
      
      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
}
