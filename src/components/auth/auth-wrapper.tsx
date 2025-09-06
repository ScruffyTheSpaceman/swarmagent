'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth/auth-context';
import LoginForm from './login-form';
import { Button } from '@/components/ui/button';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthenticatedContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Initializing QD-Enhanced AI Swarm...</p>
          <p className="text-slate-400 text-sm mt-2">Connecting to agent network and loading memory systems</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="relative">
      {/* User Info Bar */}
      <div className="fixed top-0 right-0 z-50 m-4">
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-lg px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">{user?.username}</div>
              <div className="text-xs text-slate-400">{user?.role} access</div>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-600"></div>
          <Button
            size="sm"
            variant="ghost"
            onClick={logout}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 text-xs"
          >
            🔓 Logout
          </Button>
        </div>
      </div>

      {/* Authenticated Content */}
      <div className="pr-64"> {/* Add padding for user info bar */}
        {children}
      </div>

      {/* Session Status Indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-green-600/20 border border-green-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-300 text-xs font-medium">QD System Active</span>
        </div>
      </div>
    </div>
  );
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-300 text-lg">Loading QD-Enhanced System...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AuthenticatedContent>
        {children}
      </AuthenticatedContent>
    </AuthProvider>
  );
};

export default AuthWrapper;