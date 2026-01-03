import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Search, User, LogOut, Menu, X, Calendar, Activity, Users, Moon, Sun, Mic, MicOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useVoiceCommands } from '../services/voiceCommands';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isListening, isSupported, toggleListening } = useVoiceCommands();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/trips', icon: Map, label: 'My Trips' },
    { path: '/cities', icon: Search, label: 'Cities' },
    { path: '/activities', icon: Activity, label: 'Activities' },
    { path: '/gamification', icon: Users, label: 'Achievements' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className={`min-h-screen animate-gradient-shift transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50'
    }`}>
      <style jsx="true">{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .group:hover .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Header */}
      <header className={`backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-r from-gray-800/60 via-gray-700/50 to-slate-800/60 border-gray-700/40'
          : 'bg-gradient-to-r from-blue-100/60 via-cyan-100/50 to-teal-100/60 border-cyan-200/40'
      } ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 group animate-float">
              <img 
                src="/logo.svg" 
                alt="GlobeTrotter" 
                className="h-8 w-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 mx-auto">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className={`flex items-center gap-1.5 px-2 py-1 transition-all duration-300 relative group whitespace-nowrap animate-slide-down ${
                      active
                        ? isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'
                        : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-all duration-300 flex-shrink-0 ${
                      active ? 'scale-110' : 'group-hover:scale-125 group-hover:-rotate-12'
                    }`} />
                    <span className="text-sm">{item.label}</span>
                    {active && (
                      <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-full animate-pulse-glow"></div>
                    )}
                    {!active && (
                      <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-4">
              {/* Voice Command Button */}
              {isSupported && (
                <button
                  onClick={toggleListening}
                  className={`hidden md:flex p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isListening 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : isDark 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Voice Commands'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`hidden md:flex p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={isDark ? 'Light Mode' : 'Dark Mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isDark
                  ? 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 border-gray-600/60 hover:border-gray-500'
                  : 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-cyan-200/60 hover:border-cyan-300'
              }`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm uppercase shadow-md transition-transform duration-300 hover:rotate-12">
                  {user?.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium capitalize ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>{user?.name}</p>
                  <p className={`text-xs truncate ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className={`ml-2 p-1.5 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-12 hover:text-red-600 ${
                    isDark 
                      ? 'text-gray-400 hover:bg-red-900/30' 
                      : 'text-gray-500 hover:bg-red-50'
                  }`}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br hover:from-blue-100 hover:to-cyan-100'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 animate-spin" style={{ animationDuration: '0.3s', animationIterationCount: '1' }} />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t backdrop-blur-lg animate-slide-down ${
            isDark
              ? 'border-gray-700 bg-gray-800/95'
              : 'border-gray-200 bg-white/95'
          }`}>
            <div className="px-4 py-4 space-y-2">
              {/* User Info */}
              <div className={`flex items-center gap-3 pb-4 border-b mb-2 animate-slide-down ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-lg uppercase shadow-lg">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className={`font-medium ${
                    isDark ? 'text-gray-100' : 'text-gray-900'
                  }`}>{user?.name}</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{user?.email}</p>
                </div>
              </div>

              {/* Nav Items */}
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 animate-slide-down ${
                      isActive(item.path)
                        ? isDark
                          ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-cyan-400 font-medium shadow-sm scale-105'
                          : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 font-medium shadow-sm scale-105'
                        : isDark
                          ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:scale-105'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:scale-105'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      isActive(item.path) ? 'scale-110' : 'group-hover:scale-125'
                    }`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Dark Mode & Voice Commands */}
              <div className={`flex gap-2 pt-2 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 flex-1 hover:scale-105 ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {/* Voice Commands */}
                {isSupported && (
                  <button
                    onClick={toggleListening}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 flex-1 hover:scale-105 ${
                      isListening 
                        ? 'bg-red-50 text-red-600' 
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span>{isListening ? 'Stop' : 'Voice'}</span>
                  </button>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg transition-all duration-300 w-full hover:scale-105 animate-slide-down ${
                  isDark
                    ? 'hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/30'
                    : 'hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50'
                }`}
                style={{ animationDelay: `${navItems.length * 0.05}s` }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)] animate-slide-down">{children}</main>

      {/* Footer */}
      <footer className={`bg-gradient-to-r border-t mt-12 transition-colors duration-300 ${
        isDark
          ? 'from-gray-900 via-gray-800/30 to-gray-900 border-gray-700'
          : 'from-white via-blue-50/30 to-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`text-center text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p className="inline-block hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 transition-all duration-300">
              &copy; 2026 GlobeTrotter. Empowering Personalized Travel Planning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
