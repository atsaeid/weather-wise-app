import { useState } from 'react';
import { CloudSun, LogOut, User, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  // Check if current page is map
  const isMapPage = location.pathname === '/map';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className="text-white py-3 sticky top-0 z-10 bg-slate-900/60 shadow-lg backdrop-blur-md w-full">
      <div className="px-6 md:px-8 flex justify-between items-center">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2">
          <CloudSun size={28} className="text-yellow-300" />
          <h1 className="text-xl font-semibold tracking-tight">
            <span className="text-yellow-300">Weather</span>Wise
          </h1>
        </div>

        {/* User Authentication */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center">
              <div className="hidden sm:block mr-3 text-sm text-slate-200">
                Hello, {user?.username}
              </div>
              <div className="relative group">
                <button className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <UserCircle size={22} />
                </button>
                <div className="absolute right-0 mt-2 w-48 origin-top-right bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 rounded-md shadow-lg transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                  <div className="p-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-slate-700/80 rounded-md transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Link 
                to="/login" 
                className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
              >
                <User size={16} />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
