'use client';

import { ShoppingCart, User, Menu, X, Droplet, Sun, Moon, Monitor, Bell, LogOut, Package, UserCircle, ChevronDown, Car } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useVehicleContext } from '@/context/VehicleContext';
import { useRouter, usePathname } from 'next/navigation';
import { NotificationPanel } from '@/components/shared/notification/NotificationPanel';
import { VehicleSelectionModal } from '@/components/shared/selectors/VehicleSelectionModal';
import { useCart } from '@/api/domains/cart/queries';
import { useUpdateVehicle } from '@/api/domains/vehicles/queries';
import type { Vehicle } from '@/types/vehicle';
import { toast } from 'sonner';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Products', href: '/products' },
  { name: 'Support', href: '/support' },
];

const DEFAULT_AVATAR = '/images/avatars/default-avatar.svg';

export default function EnhancedHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { selectedVehicle, selectVehicle, clearVehicle, hasVehicles } = useVehicleContext();
  const updateVehicleMutation = useUpdateVehicle();
  
  const { data: cartData } = useCart();
  const cartCount = cartData?.items?.length || 0;

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);
  

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    clearVehicle();
  };

  const handleVehicleClick = () => {
    setShowVehicleModal(true);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    selectVehicle(vehicle.id);
    updateVehicleMutation.mutate({
      id: vehicle.id,
      input: { isPrimary: true }
    }, {
      onSuccess: () => {
        toast.success(`${vehicle.brand} ${vehicle.model} is now your primary vehicle`);
      },
      onError: () => {
        toast.error('Failed to set as primary vehicle');
      }
    });
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      handleNavigation('/auth/login');
    }
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const unreadCount = 3;

  const getAvatarSrc = () => {
    if (avatarError || !user?.avatar) {
      return DEFAULT_AVATAR;
    }
    return user.avatar;
  };

  const handleAvatarError = () => {
    setAvatarError(true);
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
            {/* Logo Section */}
            <button onClick={() => handleNavigation('/')} className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
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
                const isActive = item.href === '/' 
                  ? pathname === '/' || pathname === ''
                  : pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`relative px-3 lg:px-5 py-2 lg:py-2.5 text-sm font-medium transition-all rounded-lg lg:rounded-xl cursor-pointer ${
                      isActive
                        ? 'text-primary bg-primary/15 font-semibold'
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

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Vehicle Selector */}
              {isAuthenticated && (
                <div className="relative hidden sm:block group/vehicle">
                  <button
                    onClick={handleVehicleClick}
                    className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group cursor-pointer"
                  >
                    <Car className="h-4 w-4 sm:h-5 sm:w-5 text-foreground group-hover:text-primary" />
                    {selectedVehicle && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-3 sm:w-3 rounded-full border-2 border-background bg-primary" />
                    )}
                  </button>
                  
                  {selectedVehicle && (
                    <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover/vehicle:opacity-100 group-hover/vehicle:visible transition-all duration-200 whitespace-nowrap z-50">
                      <p className="text-xs font-medium text-foreground">{selectedVehicle.brand} {selectedVehicle.model}</p>
                      <p className="text-[10px] text-muted-foreground">{selectedVehicle.plateNumber}</p>
                    </div>
                  )}
                  
                  {!selectedVehicle && (
                    <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover/vehicle:opacity-100 group-hover/vehicle:visible transition-all duration-200 whitespace-nowrap z-50">
                      <p className="text-xs text-muted-foreground">Select your vehicle</p>
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group cursor-pointer"
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
                    <div className="absolute right-0 mt-2 w-48 force-sheet-bg rounded-lg sm:rounded-xl shadow-lg border border-border py-2 z-50">
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
                            className={`px-3 lg:px-5 py-2 lg:py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 ${
                              isActive ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:bg-gray-100'
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
                  className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group cursor-pointer"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-foreground group-hover:text-primary" />
                  {isAuthenticated && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <NotificationPanel 
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  isAuthenticated={isAuthenticated}
                />
              </div>

              {/* Shopping Cart */}
              <button
                onClick={() => handleNavigation('/cart')}
                className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors group cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-foreground group-hover:text-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold rounded-full min-w-[16px] h-4 sm:min-w-[20px] sm:h-5 px-1 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
              
              {/* User Menu - Always visible */}
              <div className="relative hidden md:block">
                <button
                  onClick={handleUserIconClick}
                  className="flex items-center gap-2 px-2 lg:px-3 py-2 rounded-lg lg:rounded-xl hover:bg-muted transition-colors group cursor-pointer"
                >
                  {isAuthenticated && user ? (
                    <>
                      <img 
                        src={getAvatarSrc()} 
                        alt={user.name}
                        onError={handleAvatarError}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </>
                  ) : (
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-foreground group-hover:text-primary" />
                  )}
                </button>

                {isAuthenticated && user && showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-64 force-sheet-bg rounded-lg sm:rounded-xl shadow-lg border border-border overflow-hidden z-50">
                      <div className="px-4 py-3 bg-muted/30 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{user?.email || user?.phone}</p>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigation('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted cursor-pointer"
                        >
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            handleNavigation('/orders');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted cursor-pointer"
                        >
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>Orders & Bookings</span>
                        </button>

                        <div className="h-px bg-border my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-all cursor-pointer"
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
      ? 'max-h-[calc(100vh-5rem)] opacity-100 pointer-events-auto' 
      : 'max-h-0 opacity-0 pointer-events-none'
  }`}
>
<div className="py-3 sm:py-4 space-y-2 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-6rem)] pb-6 scroll-smooth...">
{/* User Info / Login Prompt */}
              {isAuthenticated && user ? (
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 mb-3 sm:mb-4 bg-muted/50 rounded-lg sm:rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <img 
                        src={getAvatarSrc()} 
                        alt={user.name}
                        onError={handleAvatarError}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{user?.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user?.email || user?.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleVehicleClick}
                      className="relative p-1.5 sm:p-2 rounded-lg hover:bg-muted flex-shrink-0 cursor-pointer"
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
                      <p className="text-[10px] text-muted-foreground">{selectedVehicle.plateNumber}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mx-3 sm:mx-4 mb-3 sm:mb-4">
                <button
                  onClick={() => handleNavigation('/auth/login')}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-lg sm:rounded-xl bg-primary text-primary-foreground text-sm font-semibold cursor-pointer group relative transition-all duration-300 active:translate-y-0 border border-primary/50"
                >
                  <User className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Sign In</span>
                </button>
              </div>
              
              )}

              {/* Navigation */}
              {navigation.map((item, index) => {
                const isActive = item.href === '/' 
                  ? pathname === '/' || pathname === ''
                  : pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-left transition-all cursor-pointer ${
                      mobileMenuOpen ? 'animate-slide-up' : ''
                    } ${
                      isActive
                        ? 'border-1 border-grey font-bold bg-[rgb(211,192,255)]'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    
                  >
                    {item.name}
                  </button>
                );
              })}

              {/* Account Section - Only for authenticated users */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-border mt-2">
                  <p className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Account
                  </p>
                  
                  <button
                    onClick={() => {
                      handleVehicleClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-muted cursor-pointer"
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
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-muted cursor-pointer"
                  >
                    <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavigation('/orders');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-muted cursor-pointer"
                  >
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <span>Orders & Bookings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
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
                        className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
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
