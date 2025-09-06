'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));
        setCredentials({ username: '', password: '' });
        onLoginSuccess();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error: any) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'username' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🤖</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            QD-Enhanced Swarm AI
          </h1>
          <p className="text-gray-300">Multi-LLM Agent System with Advanced Intelligence</p>
        </div>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white text-center">🔐 Secure Access</CardTitle>
            <CardDescription className="text-slate-300 text-center">
              Enter your credentials to access the AI agent swarm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertDescription className="text-red-300">
                    🚫 {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  value={credentials.username}
                  onChange={handleInputChange('username')}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  value={credentials.password}
                  onChange={handleInputChange('password')}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                disabled={isLoading || !credentials.username || !credentials.password}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <>🚀 Access AI Swarm</>
                )}
              </Button>

              <div className="text-center text-xs text-slate-400 mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                🛡️ <strong>Secure Authentication</strong>
                <br />
                All credentials are encrypted and validated through HashiCorp Vault security protocols
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            All 7 AI agents online and ready
          </div>
        </div>

        <Card className="mt-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-blue-300 font-medium mb-1">💡 Demo Access</div>
            <div className="text-xs text-blue-200">
              Use the provided credentials to explore the advanced QD-enhanced multi-agent system
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;