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
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between shadow-md z-50 sticky top-0">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
        <div className="flex items-center gap-3">
          <Car className="h-7 w-7 text-[#4fd1c5]" />
          <span className="font-bold text-lg">Carvatoo Admin</span>
        </div>
        <div className="w-7" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#1e3a5f] text-white transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-[#4fd1c5]" />
            <div>
              <span className="font-bold text-xl">Carvatoo</span>
              <p className="text-xs text-[#4fd1c5] font-medium tracking-wide">Admin-Portal</p>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-[#4fd1c5] text-[#1e3a5f] font-bold shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block ${sidebarOpen ? 'w-72' : 'w-24'} bg-[#1e3a5f] text-white min-h-screen transition-all duration-300 flex-shrink-0 relative shadow-xl z-20`}>
        <div className="p-6 border-b border-white/10 h-20 flex items-center">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <Car className="h-9 w-9 text-[#4fd1c5] flex-shrink-0" />
            {sidebarOpen && (
              <div className="min-w-0">
                <span className="font-bold text-xl block truncate">Carvatoo</span>
                <p className="text-xs text-[#4fd1c5] font-medium tracking-wide truncate">Admin-Portal</p>
              </div>
            )}
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all whitespace-nowrap overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-[#4fd1c5] text-[#1e3a5f] font-bold shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#162d47]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 w-full text-white/80 hover:bg-white/10 hover:text-white rounded-xl transition-colors overflow-hidden"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Abmelden</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-8 py-5 h-20 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Suche im Admin-Bereich..."
                className="pl-11 w-80 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-6 w-6 text-gray-500" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <span className="block text-sm font-bold text-gray-800 leading-tight">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="block text-xs text-gray-500 font-medium">Administrator</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold shadow-md border-2 border-[#4fd1c5]">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
