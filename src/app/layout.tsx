import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryProvider } from '@/providers/providers';
import { AuthProvider } from '@/context/AuthContext';
import { VehicleProvider } from '@/context/VehicleContext';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Eazy Wash - Professional Car Washing Services',
  description: 'Book professional car wash and detailing services at your doorstep. Premium quality, affordable prices.',
  keywords: 'car wash, car detailing, mobile car wash, professional car cleaning, doorstep car wash',
  authors: [{ name: 'Eazy Wash Services' }],
  creator: 'Eazy Wash',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://carwash.com',
    title: 'Eazy Wash - Professional Car Washing Services',
    description: 'Book professional car wash and detailing services at your doorstep.',
    siteName: 'Eazy Wash',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eazy Wash - Professional Car Washing Services',
    description: 'Book professional car wash and detailing services at your doorstep.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth bg-background" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var s=localStorage.getItem('carwash-theme')||'system';var r=s==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):s;var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);e.setAttribute('data-theme',r);}catch(e){}}();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased text-foreground transition-colors duration-300`}
      >
        <QueryProvider>
          <AuthProvider>
            <VehicleProvider>
              <ThemeProvider>
                {children}
                <Toaster
                  position="top-right"
                  expand={false}
                  richColors
                  closeButton
                  duration={3000}
                />
              </ThemeProvider>
            </VehicleProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

