import { useState, useEffect } from 'react';
import { CloudSun, ArrowLeft, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginCredentials } from '../services/authService';

// Background configurations - beautiful gradients
const gradients = [
  'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)',
  'linear-gradient(90deg, #0369a1 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #155e75 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #4338ca 0%, #a855f7 50%, #ec4899 100%)',
  'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 50%, #10b981 100%)',
  'linear-gradient(135deg, #c026d3 0%, #7c3aed 50%, #3730a3 100%)',
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Add auth-page class to body
    document.body.classList.add('auth-page');
    
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    
    // Set random gradient background on component mount
    const randomIndex = Math.floor(Math.random() * gradients.length);
    setBackgroundStyle(gradients[randomIndex]);
    
    // Remove auth-page class when component unmounts
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = { email, password };
      await login(credentials);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundImage: backgroundStyle }}
    >
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
            <p className="text-white/80 mt-2">Sign in to access your weather preferences</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl">
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-md p-3 mb-6 text-white text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></span>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-yellow-300 hover:underline font-medium">
                  Create an account
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

export default LoginPage; 