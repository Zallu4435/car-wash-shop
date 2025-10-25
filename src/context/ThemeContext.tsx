'use client';

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode,
  useCallback 
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'carwash-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  }, []);

  // Apply theme to document - THIS IS THE KEY FIX
  const applyTheme = useCallback((resolved: ResolvedTheme) => {
    const root = document.documentElement;
    
    // Remove both classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(resolved);
    
    // Also set data attribute for compatibility
    root.setAttribute('data-theme', resolved);
    
    console.log('Theme applied:', resolved); // Debug log
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'light';
    const resolved = savedTheme === 'system' ? getSystemTheme() : savedTheme;
    
    setThemeState(savedTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
    
    console.log('Initial theme:', savedTheme, 'Resolved:', resolved); // Debug log
  }, [getSystemTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolved);
      applyTheme(newResolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted, applyTheme]);

  // Set theme function
  const setTheme = useCallback((newTheme: Theme) => {
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
    
    setThemeState(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    
    console.log('Theme changed to:', newTheme, 'Resolved:', resolved); // Debug log
  }, [getSystemTheme, applyTheme]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // Prevent hydration mismatch
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        resolvedTheme, 
        toggleTheme, 
        setTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
