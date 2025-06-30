import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartLine, Search, Menu, X } from 'lucide-react';

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery);
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center cursor-pointer">
                  <ChartLine className="text-primary mr-2" size={24} />
                  PriceTracker
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-primary' 
                      : 'text-slate-700 hover:text-primary'
                  }`}>
                    Categories
                  </a>
                </Link>
                {isAuthenticated && (
                  <Link href="/watchlist">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/watchlist') 
                        ? 'text-primary' 
                        : 'text-slate-500 hover:text-primary'
                    }`}>
                      Watchlist
                    </a>
                  </Link>
                )}
                <Link href="/about">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/about') 
                      ? 'text-primary' 
                      : 'text-slate-500 hover:text-primary'
                  }`}>
                    About
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4"
              />
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            </form>
            
            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-700">
                      {user.firstName || user.email || 'User'}
                    </span>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => window.location.href = '/api/login'}>
                Login
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
            <Link href="/">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'text-primary bg-slate-50' : 'text-slate-700'
              }`}>
                Categories
              </a>
            </Link>
            {isAuthenticated && (
              <Link href="/watchlist">
                <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/watchlist') ? 'text-primary bg-slate-50' : 'text-slate-500'
                }`}>
                  Watchlist
                </a>
              </Link>
            )}
            <Link href="/about">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/about') ? 'text-primary bg-slate-50' : 'text-slate-500'
              }`}>
                About
              </a>
            </Link>
            
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="px-3 py-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
