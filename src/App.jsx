import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TransactionProvider } from './context/TransactionContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import AddTransaction from './pages/AddTransaction/AddTransaction';
import Profile from './pages/Profile/Profile';
import Transactions from './pages/Transactions/Transactions';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const showSidebar = currentUser && !isAuthPage;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0c0c14]' : 'bg-slate-50'}`}>
      {showSidebar && (
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          showSidebar
            ? sidebarCollapsed
              ? 'lg:ml-[72px]'
              : 'lg:ml-[240px]'
            : ''
        }`}
      >
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-transaction"
              element={
                <PrivateRoute>
                  <AddTransaction />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {showSidebar && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <TransactionProvider>
            <AppLayout />
          </TransactionProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
