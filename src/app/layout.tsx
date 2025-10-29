import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'CarWash - Professional Car Washing Services',
  description: 'Book professional car wash and detailing services at your doorstep. Premium quality, affordable prices.',
  keywords: 'car wash, car detailing, mobile car wash, professional car cleaning, doorstep car wash',
  authors: [{ name: 'CarWash Services' }],
  creator: 'CarWash',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://carwash.com',
    title: 'CarWash - Professional Car Washing Services',
    description: 'Book professional car wash and detailing services at your doorstep.',
    siteName: 'CarWash',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarWash - Professional Car Washing Services',
    description: 'Book professional car wash and detailing services at your doorstep.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
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
    <html lang="en" suppressHydrationWarning className="scroll-smooth bg-background">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var s=localStorage.getItem('carwash-theme')||'system';var r=s==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):s;var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);e.setAttribute('data-theme',r);}catch(e){}}();`,
          }}
        />
      </head>
      <body 
        className={`${inter.variable} font-sans antialiased text-foreground transition-colors duration-300`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

