'use client';

import React from 'react';
import LoginForm from '@/components/auth/login-form';

const LoginPage = () => {
  const handleLoginSuccess = () => {
    // Redirect to main dashboard after successful login
    window.location.href = '/';
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
};

export default LoginPage;