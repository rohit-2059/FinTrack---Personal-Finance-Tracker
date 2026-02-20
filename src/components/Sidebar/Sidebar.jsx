import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FaWallet,
  FaTh,
  FaPlusCircle,
  FaCog,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaChevronLeft,
  FaChevronRight,
  FaExchangeAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

function Sidebar({ collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen }) {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

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
    { to: '/transactions', label: 'Transactions', icon: FaExchangeAlt },
    { to: '/add-transaction', label: 'Add Transaction', icon: FaPlusCircle },
    { to: '/profile', label: 'Settings', icon: FaCog },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`lg:hidden fixed top-4 left-4 z-[60] p-3 rounded-xl transition-all ${
          darkMode
            ? 'bg-[#16161e] text-slate-200 border border-[#1e1e2a]'
            : 'bg-white text-slate-800 border border-slate-200 shadow-lg'
        }`}
      >
        {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        } ${
          darkMode
            ? 'bg-[#111118] border-r border-[#1e1e2a]'
            : 'bg-white border-r border-slate-200'
        } lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-900 text-white flex-shrink-0">
          <FaWallet size={15} />
        </div>
        {!collapsed && (
          <span className={`text-lg font-bold tracking-tight whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            HisabKitab
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              title={collapsed ? link.label : ''}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                collapsed ? 'justify-center' : ''
              } ${
                active
                  ? darkMode
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-900'
                  : darkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`px-3 pb-4 space-y-1 ${darkMode ? 'border-t border-[#1e1e2a]' : 'border-t border-slate-100'} pt-3`}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={collapsed ? (darkMode ? 'Light mode' : 'Dark mode') : ''}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 cursor-pointer ${
            collapsed ? 'justify-center' : ''
          } ${
            darkMode
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {darkMode ? <FaSun size={16} className="flex-shrink-0" /> : <FaMoon size={16} className="flex-shrink-0" />}
          {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 cursor-pointer ${
            collapsed ? 'justify-center' : ''
          } text-red-500 ${
            darkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
          }`}
        >
          <FaSignOutAlt size={15} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse Toggle - Desktop Only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 cursor-pointer ${
            collapsed ? 'justify-center' : ''
          } ${
            darkMode
              ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          {collapsed ? (
            <FaChevronRight size={14} className="flex-shrink-0" />
          ) : (
            <>
              <FaChevronLeft size={14} className="flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
