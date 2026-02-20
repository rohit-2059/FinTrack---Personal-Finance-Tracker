import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaEye, FaEyeSlash, FaWallet, FaSun, FaMoon, FaGoogle } from 'react-icons/fa';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, signInWithGoogle } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'Failed to create account. Please try again';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors ${darkMode ? 'bg-[#0c0c14]' : 'bg-slate-50'}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-all ${darkMode ? 'bg-[#16161e] border border-[#1e1e2a] text-slate-400' : 'bg-white border border-slate-200 text-slate-500'}`}
      >
        {darkMode ? <FaSun size={13} /> : <FaMoon size={13} />}
      </button>

      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
        {/* Left Side — Image */}
        <div className="hidden lg:flex w-full lg:w-1/2 items-center">
          <div className="relative rounded-2xl overflow-hidden w-full h-[700px]">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop"
              alt="Finance planning"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <h3 className="text-4xl font-bold text-white mb-4 leading-tight">Start Your Financial Journey</h3>
              <p className="text-base text-slate-300 leading-relaxed max-w-lg">
                Join thousands of users taking control of their money. Free, secure, and built for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side — Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                <FaWallet size={16} />
              </div>
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                HisabKitab
              </span>
            </div>

            {/* Card */}
            <div className={`py-8 px-6 rounded-xl sm:px-10 ${darkMode ? 'bg-[#16161e] border border-[#1e1e2a]' : 'bg-white border border-slate-200'}`}>
              <div className="mb-6 text-center">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Create Account
                </h2>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name */}
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    disabled={loading}
                    className={`appearance-none block w-full px-3.5 py-2.5 border rounded-lg text-base transition-all ${darkMode
                      ? 'bg-[#111118] border-[#1e1e2a] text-slate-200 placeholder-slate-600 focus:border-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400'
                    } focus:outline-none disabled:opacity-50`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={loading}
                    className={`appearance-none block w-full px-3.5 py-2.5 border rounded-lg text-base transition-all ${darkMode
                      ? 'bg-[#111118] border-[#1e1e2a] text-slate-200 placeholder-slate-600 focus:border-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400'
                    } focus:outline-none disabled:opacity-50`}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      disabled={loading}
                      className={`appearance-none block w-full px-3.5 py-2.5 pr-10 border rounded-lg text-base transition-all ${darkMode
                        ? 'bg-[#111118] border-[#1e1e2a] text-slate-200 placeholder-slate-600 focus:border-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400'
                      } focus:outline-none disabled:opacity-50`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${darkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                    className={`appearance-none block w-full px-3.5 py-2.5 border rounded-lg text-base transition-all ${darkMode
                      ? 'bg-[#111118] border-[#1e1e2a] text-slate-200 placeholder-slate-600 focus:border-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400'
                    } focus:outline-none disabled:opacity-50`}
                  />
                </div>

                {/* Submit */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2.5 px-6 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="mt-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${darkMode ? 'border-[#1e1e2a]' : 'border-slate-200'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className={`px-3 ${darkMode ? 'bg-[#16161e] text-slate-600' : 'bg-white text-slate-400'}`}>Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode
                  ? 'bg-[#111118] border border-[#1e1e2a] text-slate-200 hover:bg-[#1a1a24]'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FaGoogle size={16} className="text-red-500" />
                Sign in with Google
              </button>

              {/* User Divider */}
              <div className="mt-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${darkMode ? 'border-[#1e1e2a]' : 'border-slate-200'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className={`px-3 ${darkMode ? 'bg-[#16161e] text-slate-600' : 'bg-white text-slate-400'}`}>Already on HisabKitab?</span>
                  </div>
                </div>

                {/* Footer Links */}
                <div className="mt-4 text-center space-y-2">
                  <Link
                    to="/login"
                    className={`text-xs font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Sign in instead
                  </Link>
                  <br />
                  <Link
                    to="/"
                    className={`text-xs transition-colors ${darkMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    &larr; Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
