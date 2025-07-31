import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Shield, Home, Package, HelpCircle, ShoppingCart, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import LoginButton from '../auth/LoginButton';
import SignUpButton from '../auth/SignUpButton';
import LogoutButton from '../auth/LogoutButton';
import UserProfile from '../auth/UserProfile';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Removido searchQuery pois não haverá barra de pesquisa
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  console.log('AuthContext:', { isAuthenticated, isLoading });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated, location]);

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/api/cart');
      if (response.data.success) {
        setCartCount(response.data.total_items);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Função para obter nome do usuário
  const getUserDisplayName = () => {
    if (!userProfile) return '';
    return userProfile.name || userProfile.nickname || userProfile.email;
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
  ];

  const authenticatedItems = [
    { name: 'My Orders', href: '/orders', icon: Package },
    // Removido 'Profile' da navbar
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg cheat-gradient flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl cheat-gradient-text">CheatStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {isAuthenticated && userProfile?.roles?.includes('private_access') && (
              <Link
                key="Private"
                to="/products?category=private"
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/products?category=private') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Private</span>
              </Link>
            )}
          </nav>

          {/* Search Bar removida */}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            {isAuthenticated && (
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Auth Section */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <UserProfile />
                    <LogoutButton variant="ghost" size="sm" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LoginButton variant="outline" size="sm" />
                    <SignUpButton variant="default" size="sm" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {isAuthenticated && userProfile?.roles?.includes('private_access') && (
                <Link
                  key="Private"
                  to="/products?category=private"
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/products?category=private') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  <span>Private</span>
                </Link>
              )}

              {isAuthenticated && authenticatedItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Cart */}
              {isAuthenticated && (
                <Link 
                  to="/cart" 
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                </Link>
              )}
              
              {/* Mobile Search removida */}

              {/* Mobile Auth */}
              <div className="border-t border-border/40 pt-4 space-y-2">
                {!isLoading && (
                  <>
                    {isAuthenticated ? (
                      <>
                        <UserProfile />
                        <LogoutButton variant="ghost" size="sm" className="w-full justify-start" />
                      </>
                    ) : (
                      <>
                        <LoginButton variant="outline" size="sm" className="w-full justify-start" />
                        <SignUpButton variant="default" size="sm" className="w-full justify-start" />
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

