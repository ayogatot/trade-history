import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/trades', label: 'History', icon: List },
    { path: '/add', label: 'Add Trade', icon: PlusCircle },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-background/90 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 z-50 md:top-6 md:bottom-auto">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="hidden md:block font-bold text-xl text-primary tracking-tight">
          Trade<span className="text-accent">History</span>
        </div>
        
        <div className="flex w-full md:w-auto justify-between md:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={clsx(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                  isActive ? "text-accent scale-110" : "text-gray-400 hover:text-primary hover:scale-105"
                )}
              >
                <Icon size={24} className={clsx(isActive && "fill-current opacity-20")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
