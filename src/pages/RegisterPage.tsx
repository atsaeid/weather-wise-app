import { useState, useEffect } from 'react';
import { CloudSun, ArrowLeft, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterCredentials } from '../services/authService';

// Array of beautiful gradients with patterns for random backgrounds
const backgroundStyles = [
  'bg-gradient-to-br from-blue-600 to-purple-700 bg-pattern-dots',
  'bg-gradient-to-r from-sky-400 to-indigo-900 bg-pattern-waves',
  'bg-gradient-to-br from-cyan-500 to-blue-800 bg-pattern-weather',
  'bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 bg-pattern-dots',
  'bg-gradient-to-br from-blue-700 via-cyan-600 to-emerald-600 bg-pattern-waves',
  'bg-gradient-to-br from-fuchsia-600 via-violet-700 to-indigo-800 bg-pattern-weather',
];

// Weather-themed background SVGs
const bgPatterns = [
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M29.5 10.5c0-5 2-10 8-10s8 5 8 10c0 6-5 10-8 10s-8-4-8-10zm8 20.5c-5 0-10 2-10 8s5 8 10 8 10-2 10-8-5-8-10-8zm-20 20c6 0 10-5 10-8s-4-8-10-8-10 5-10 8 4 8 10 8zM20.5 20.5c0-6 5-10 8-10s8 4 8 10c0 5-2 10-8 10s-8-5-8-10z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"
];

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState('');

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Set a random gradient background on component mount
    const randomIndex = Math.floor(Math.random() * backgroundStyles.length);
    setBackgroundStyle(backgroundStyles[randomIndex]);
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const credentials: RegisterCredentials = { username, email, password };
      await register(credentials);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${backgroundStyle}`}>
      {/* Header with back button */}
      <div className="p-4">
        <Link to="/" className="inline-flex items-center text-white hover:text-yellow-300 transition-colors">
          <ArrowLeft className="mr-2" size={18} />
          <span>Back to Weather</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/10 backdrop-blur-md mb-4">
              <CloudSun size={40} className="text-yellow-300" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              <span className="text-yellow-300">Weather</span>Wise
            </h1>
            <p className="text-white/80 mt-2">Create an account to save your favorite locations</p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl">
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-md p-3 mb-6 text-white text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={18} className="text-white/60" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={18} className="text-white/60" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-white/60" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-white/60" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-yellow-300 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-8 text-center text-white/60 text-xs">
            <p>
              &copy; {new Date().getFullYear()} WeatherWise. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 