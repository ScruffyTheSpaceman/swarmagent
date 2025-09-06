'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Architecture', icon: '🏗️' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/qd-enhanced', label: 'QD Enhanced', icon: '🧠' },
    { href: '/api-keys', label: 'API Keys', icon: '🔑' },
    { href: '/download', label: 'Download', icon: '📦' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🤖</span>
            </div>
            <div>
              <span className="text-white font-semibold">QD Swarm AI</span>
              <Badge variant="outline" className="ml-2 text-xs text-purple-300 border-purple-500">
                Enhanced
              </Badge>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    pathname === item.href 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "text-gray-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* System Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">7 Agents Online</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              QD-Enhanced
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;