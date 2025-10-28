'use client';

import { ShoppingCart, User, Menu, X, Droplet, Sun, Moon, Monitor, Bell, LogOut, Package, UserCircle, ChevronDown, Car } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { NotificationPanel } from '@/components/shared/notification/NotificationPanel';
import { VehicleSelectionModal } from '@/components/shared/selectors/VehicleSelectionModal';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Products', href: '/products' },
  { name: 'Support', href: '/support' },
];

interface Vehicle {
  id: string;
  type: 'car' | 'bike';
  category: string;
  brand: string;
  model: string;
  year: string;
  plateNumber?: string;
}

export default function EnhancedHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserMenu(false);
    setSelectedVehicle(null);
    router.push('/');
  };

  const handleVehicleClick = () => {
    if (selectedVehicle) {
      router.push('/settings/vehicles');
    } else {
      setShowVehicleModal(true);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    localStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const unreadCount = 3;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border' 
            : 'bg-background shadow-sm border-b border-border'
        }`}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section - Responsive */}
            <button onClick={() => handleNavigation('/')} className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-lg sm:rounded-xl blur-md sm:blur-lg opacity-40 group-hover:opacity-60 transition-all"></div>
                <div className="relative bg-primary p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                  <Droplet className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-bold text-foreground tracking-tight">
                  CarWash
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5 font-medium">
                  Premium Service
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`relative px-3 lg:px-5 py-2 lg:py-2.5 text-sm font-medium transition-all rounded-lg lg:rounded-xl ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 lg:w-1.5 lg:h-1.5 bg-primary rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Actions - Responsive */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Vehicle Selector */}
              {isLoggedIn && (
                <button
                  onClick={handleVehicleClick}
                  className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group hidden sm:block"
                  title={selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'Select vehicle'}
                >
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-foreground group-hover:text-primary" />
                  {selectedVehicle && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-3 sm:w-3 rounded-full border-2 border-background bg-primary" />
                  )}
                </button>
              )}

              {/* Theme Toggle */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group"
                >
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary" />
                  ) : (
                    <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary" />
                  )}
                </button>

                {showThemeMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg sm:rounded-xl shadow-lg border border-border py-2 z-50">
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
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="flex-1 text-left">{option.label}</span>
                            {isActive && <div className="h-2 w-2 rounded-full bg-primary" />}
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
                  className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-foreground group-hover:text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
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
                className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-foreground group-hover:text-primary" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  0
                </span>
              </button>
              
              {/* User Menu */}
              {isLoggedIn ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 lg:px-3 py-2 rounded-lg lg:rounded-xl hover:bg-muted transition-colors group"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover ring-2 ring-primary/20"
                      />
                    ) : (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm ring-2 ring-primary/20">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-64 bg-card rounded-lg sm:rounded-xl shadow-lg border border-border overflow-hidden z-50">
                        <div className="px-4 py-3 bg-muted/50 border-b border-border">
                          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={() => {
                              handleNavigation('/profile');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                          >
                            <UserCircle className="h-4 w-4 text-muted-foreground" />
                            <span>My Profile</span>
                          </button>

                          <button
                            onClick={() => {
                              handleNavigation('/orders');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                          >
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>My Orders</span>
                          </button>

                          <div className="h-px bg-border my-2"></div>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
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
                  className="hidden md:flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-xl hover:scale-105"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-all"
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
            className={`md:hidden overflow-hidden transition-all duration-500 ${
              mobileMenuOpen 
                ? 'max-h-[700px] opacity-100 pb-6' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-3 sm:py-4 space-y-2">
              {/* User Info */}
              {isLoggedIn && (
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 mb-3 sm:mb-4 bg-muted/50 rounded-lg sm:rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-primary/20 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm ring-2 ring-primary/20 flex-shrink-0">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleVehicleClick}
                      className="relative p-1.5 sm:p-2 rounded-lg hover:bg-muted flex-shrink-0"
                    >
                      <Car className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                      {selectedVehicle && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-primary rounded-full border border-background" />
                      )}
                    </button>
                  </div>
                  {selectedVehicle && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Selected Vehicle</p>
                      <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                        {selectedVehicle.brand} {selectedVehicle.model}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-left transition-all ${
                      mobileMenuOpen ? 'animate-slide-up' : ''
                    } ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}

              {/* Account Section */}
              {isLoggedIn && (
                <div className="pt-2 border-t border-border mt-2">
                  <p className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Account
                  </p>
                  
                  <button
                    onClick={() => {
                      handleVehicleClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-muted"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Car className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      <span>My Vehicle</span>
                    </div>
                    {selectedVehicle && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      handleNavigation('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-muted"
                  >
                    <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavigation('/orders');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-muted"
                  >
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
              
              {/* Theme Selector */}
              <div className="pt-2 border-t border-border mt-2">
                <p className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Theme
                </p>
                <div className="grid grid-cols-3 gap-2 px-3 sm:px-4">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = theme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all ${
                          isActive
                            ? 'bg-primary/10 text-primary border-2 border-primary'
                            : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                        }`}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-[10px] sm:text-xs font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Button */}
              {!isLoggedIn && (
                <button
                  onClick={() => handleNavigation('/auth/login')}
                  className="flex items-center justify-center gap-2 w-full mt-3 sm:mt-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-md"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      <VehicleSelectionModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSelect={handleVehicleSelect}
        selectedVehicleId={selectedVehicle?.id}
      />
    </>
  );
}
