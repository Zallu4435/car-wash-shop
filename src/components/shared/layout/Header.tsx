'use client';

import { ShoppingCart, User, Menu, X, Droplet, Sun, Moon, Monitor, Bell, LogOut, Package, UserCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { NotificationPanel } from '@/components/shared/notification/NotificationPanel';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Products', href: '/products' },
  { name: 'Support', href: '/support' },
];

export default function EnhancedHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Mock user data - replace with actual auth state
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Change to false to show login button
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '', // Leave empty to show default avatar
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    setIsLoggedIn(false);
    setShowUserMenu(false);
    router.push('/');
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  // Mock unread notification count
  const unreadCount = 3;

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-border' 
          : 'bg-background shadow-sm'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <button onClick={() => handleNavigation('/')} className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
              <div className="relative bg-primary p-2.5 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Droplet className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">
                CarWash
              </span>
              <span className="text-xs text-muted-foreground -mt-0.5 font-medium">
                Premium Service
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`cursor-pointer relative px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="cursor-pointer p-2.5 rounded-xl hover:bg-muted transition-colors group"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Moon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>

              {showThemeMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThemeMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-50 animate-fade-in">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = theme === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setTheme(option.value);
                            setShowThemeMenu(false);
                          }}
                          className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'text-primary bg-primary/10'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 text-left">{option.label}</span>
                          {isActive && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="cursor-pointer relative p-2.5 rounded-xl hover:bg-muted transition-colors group"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationPanel 
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            {/* Shopping Cart */}
            <button
              onClick={() => handleNavigation('/cart')}
              className="cursor-pointer relative p-2.5 rounded-xl hover:bg-muted transition-colors group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                0
              </span>
            </button>
            
            {/* User Menu or Login Button */}
            {isLoggedIn ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors group"
                  aria-label="User menu"
                >
                  {/* Avatar */}
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
                      {/* User Info */}
                      <div className="px-4 py-3 bg-muted/50 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigation('/profile');
                            setShowUserMenu(false);
                          }}
                          className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            handleNavigation('/orders');
                            setShowUserMenu(false);
                          }}
                          className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>My Orders</span>
                        </button>

                        <div className="h-px bg-border my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('/auth/login')}
                className="cursor-pointer hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer md:hidden p-2.5 rounded-xl hover:bg-muted transition-all duration-300"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <Menu 
                  className={`h-5 w-5 text-foreground absolute transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                />
                <X 
                  className={`h-5 w-5 text-foreground absolute transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen 
              ? 'max-h-[700px] opacity-100 pb-6' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2">
            {/* User Info on Mobile (if logged in) */}
            {isLoggedIn && (
              <div className="px-4 py-3 mb-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold ring-2 ring-primary/20">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`cursor-pointer w-full block px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                    mobileMenuOpen ? 'animate-slide-up' : ''
                  } ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}

            {/* Mobile User Menu (if logged in) */}
            {isLoggedIn && (
              <>
                <div className="pt-2 border-t border-border mt-2">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Account
                  </p>
                  <button
                    onClick={() => {
                      handleNavigation('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavigation('/orders');
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
            
            {/* Mobile Theme Selector */}
            <div className="pt-2 border-t border-border mt-2">
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Theme
              </p>
              <div className="grid grid-cols-3 gap-2 px-4">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`cursor-pointer flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary/10 text-primary border-2 border-primary'
                          : 'bg-muted text-foreground hover:bg-muted/80 border-2 border-transparent'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Login Button (if not logged in) */}
            {!isLoggedIn && (
              <button
                onClick={() => handleNavigation('/auth/login')}
                className="cursor-pointer flex items-center justify-center gap-2 mt-4 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-300 shadow-md w-full"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
