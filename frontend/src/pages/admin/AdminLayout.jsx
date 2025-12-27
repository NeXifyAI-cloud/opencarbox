import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, 
  Settings, Tag, LogOut, Menu, X, ChevronDown, Bell, Search,
  Wrench, Car
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLayout = ({ children }) => {
  const { user, token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Produkte', path: '/admin/produkte' },
    { icon: Wrench, label: 'Werkstatt', path: '/admin/werkstatt' },
    { icon: Car, label: 'Fahrzeuge', path: '/admin/fahrzeuge' },
    { icon: FolderTree, label: 'Kategorien', path: '/admin/kategorien' },
    { icon: ShoppingCart, label: 'Bestellungen', path: '/admin/bestellungen' },
    { icon: Users, label: 'Kunden', path: '/admin/kunden' },
    { icon: Tag, label: 'Gutscheine', path: '/admin/gutscheine' },
    { icon: Settings, label: 'Einstellungen', path: '/admin/einstellungen' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#1e3a5f] text-white px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-[#4fd1c5]" />
          <span className="font-bold">Carvatoo Admin</span>
        </div>
        <div className="w-6" />
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-[#1e3a5f] text-white" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Car className="h-8 w-8 text-[#4fd1c5]" />
                <div>
                  <span className="font-bold text-lg">Carvatoo</span>
                  <p className="text-xs text-[#4fd1c5]">Admin-Portal</p>
                </div>
              </div>
            </div>
            <nav className="p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      isActive(item.path)
                        ? 'bg-[#4fd1c5] text-[#1e3a5f]'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1e3a5f] text-white min-h-screen transition-all duration-300`}>
          <div className="p-4 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-[#4fd1c5]" />
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-lg">Carvatoo</span>
                  <p className="text-xs text-[#4fd1c5]">Admin-Portal</p>
                </div>
              )}
            </Link>
          </div>
          
          <nav className="p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#4fd1c5] text-[#1e3a5f]'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-white/80 hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span>Abmelden</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <header className="bg-white shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="h-5 w-5 text-gray-500" />
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Suchen..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#4fd1c5] flex items-center justify-center text-[#1e3a5f] font-bold">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
