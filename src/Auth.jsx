// src/Auth.jsx
import { useState } from 'react';
import * as Sentry from '@sentry/react';
import { supabase } from './lib/supabase';
import { useUser } from './hooks/useUser';
import { Mail, Lock, User as UserIcon, AlertCircle, CheckCircle, LogIn, UserPlus, Loader } from 'lucide-react';

export default function AuthComponent() {
  const { user, profile, signOut } = useUser();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    // Alphanumeric and underscores only, 3-20 characters
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    clearMessages();

    // Client-side validation
    if (!email || !password || !username) {
      setError('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validateUsername(username)) {
      setError('Username must be 3-20 characters and contain only letters, numbers, and underscores');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (authError) {
        // Log authentication errors to Sentry with warning level
        Sentry.captureMessage('Signup authentication error', {
          level: 'warning',
          tags: {
            auth_flow: 'signup',
            error_type: 'authentication'
          },
          contexts: {
            auth: {
              email: email,
              error_code: authError.code,
              error_message: authError.message
            }
          }
        });

        // User-friendly error messages
        if (authError.message.includes('already registered')) {
          setError('This email is already registered. Please login instead.');
        } else if (authError.message.includes('Invalid email')) {
          setError('Please enter a valid email address');
        } else {
          setError(authError.message || 'Failed to create account. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success! The database trigger will automatically create the profile
      if (authData.user) {
        Sentry.captureMessage('Successful user signup', {
          level: 'info',
          tags: {
            auth_flow: 'signup'
          },
          user: {
            id: authData.user.id,
            email: email,
            username: username
          }
        });

        setSuccessMessage(
          'Account created successfully! Please check your email for a verification link. You must verify your email before you can log in.'
        );
        
        // Clear form
        setEmail('');
        setPassword('');
        setUsername('');
      }
    } catch (error) {
      // Catch unexpected errors
      Sentry.captureException(error, {
        level: 'error',
        tags: {
          auth_flow: 'signup',
          error_type: 'unexpected'
        },
        contexts: {
          signup: {
            email: email,
            username: username
          }
        }
      });

      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();

    // Client-side validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        // Log authentication errors to Sentry
        Sentry.captureMessage('Login authentication error', {
          level: 'warning',
          tags: {
            auth_flow: 'login',
            error_type: 'authentication'
          },
          contexts: {
            auth: {
              email: email,
              error_code: authError.code,
              error_message: authError.message
            }
          }
        });

        // User-friendly error messages
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please verify your email before logging in. Check your inbox for the verification link.');
        } else {
          setError(authError.message || 'Login failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success! Log to Sentry
      if (data.user) {
        Sentry.captureMessage('Successful user login', {
          level: 'info',
          tags: {
            auth_flow: 'login'
          },
          user: {
            id: data.user.id,
            email: email
          }
        });

        // Set user context for future error tracking
        Sentry.setUser({
          id: data.user.id,
          email: email
        });

        // Refresh page to trigger UserProvider to fetch profile
        window.location.reload();
      }
    } catch (error) {
      // Catch unexpected errors
      Sentry.captureException(error, {
        level: 'error',
        tags: {
          auth_flow: 'login',
          error_type: 'unexpected'
        },
        contexts: {
          login: {
            email: email
          }
        }
      });

      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Retry handler
  const handleRetry = () => {
    clearMessages();
    // resetCaptcha is not available in this component; no-op here.
  };

  // If user is already logged in, show profile info
  if (user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
              <p className="text-slate-400">
                {profile?.username ? `@${profile.username}` : user.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {profile?.is_pro === 'true' && (
                  <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                    Studio Pass Member
                  </span>
                )}
                {profile?.is_beta === 'true' && (
                  <span className="inline-block px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                    Beta Tester
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                Sentry.setUser(null);
                window.location.reload();
              }}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auth form UI
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">VRS/A</h1>
          <p className="text-slate-400">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => {
              setMode('login');
              clearMessages();
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              mode === 'login'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn size={16} className="inline mr-2" />
            Login
          </button>
          <button
            onClick={() => {
              setMode('signup');
              clearMessages();
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus size={16} className="inline mr-2" />
            Sign Up
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-start">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-red-200 text-sm">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Success Display */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-900/20 border border-green-500 rounded-lg flex items-start">
            <CheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-200 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === 'signup' ? handleSignup : handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Username Field (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-slate-500" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="username"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
            {mode === 'signup' && (
              <p className="text-xs text-slate-500 mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                {mode === 'signup' ? 'Creating account...' : 'Logging in...'}
              </>
            ) : (
              <>
                {mode === 'signup' ? (
                  <>
                    <UserPlus className="mr-2" size={20} />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2" size={20} />
                    Log In
                  </>
                )}
              </>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    clearMessages();
                  }}
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    clearMessages();
                  }}
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
