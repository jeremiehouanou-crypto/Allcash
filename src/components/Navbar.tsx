import React from 'react';
import { Shield } from 'lucide-react';
import { IconWrapper } from './common/IconWrapper';
import Navigation from './Navigation';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 backdrop-blur-xl bg-slate-900/75">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <IconWrapper icon={Shield} className="w-8 h-8 text-violet-400" />
            <span className="ml-2 text-xl font-bold tracking-wider">AllCash Tech</span>
          </div>
          <Navigation />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;