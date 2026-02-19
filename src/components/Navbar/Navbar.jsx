import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaWallet, FaTh, FaPlusCircle, FaUser, FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  if (!currentUser) return null;

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: FaTh },
    { to: '/add-transaction', label: 'Add Transaction', icon: FaPlusCircle },
    { to: '/profile', label: 'Profile', icon: FaUser },
  ];

  return (
    <nav className={`sticky top-0 z-50 ${darkMode
      ? 'bg-[#0f0f1a]/95 border-b border-[#2a2a40] shadow-lg shadow-black/30'
      : 'bg-white/95 border-b border-gray-200 shadow-sm'
    } backdrop-blur-md`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-600 text-white shadow-md shadow-blue-600/30 transition-transform duration-300 group-hover:scale-110">
              <FaWallet size={16} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              FinTrack
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${darkMode ? 'text-gray-300 hover:bg-[#1a1a2e]' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.to)
                    ? (darkMode
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'bg-blue-50 text-blue-600')
                    : (darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-[#1a1a2e]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Divider */}
            <div className={`w-px h-8 mx-2 ${darkMode ? 'bg-[#2a2a40]' : 'bg-gray-200'}`} />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${darkMode
                ? 'text-gray-400 hover:text-yellow-400 hover:bg-[#1a1a2e]'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
            >
              <FaSignOutAlt size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className={`lg:hidden pb-4 pt-2 space-y-1 border-t ${darkMode ? 'border-[#2a2a40]' : 'border-gray-100'}`}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.to)
                    ? (darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600')
                    : (darkMode ? 'text-gray-400 hover:text-white hover:bg-[#1a1a2e]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={toggleTheme}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${darkMode
                  ? 'text-gray-400 hover:bg-[#1a1a2e]'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                <span>{darkMode ? 'Light' : 'Dark'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                <FaSignOutAlt size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
