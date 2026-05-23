import React from 'react';
import { Mail, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900/75 border-t border-slate-800 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="w-6 h-6 text-violet-400 mr-2" />
            <span className="text-lg font-bold">AllCash Tech</span>
          </div>
          
          <a 
            href="mailto:support@allcashtech.com" 
            className="flex items-center text-gray-400 hover:text-violet-400 transition-colors group"
          >
            <Mail className="w-4 h-4 mr-2 group-hover:text-violet-400" />
            <span>Contact Support</span>
          </a>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AllCash Tech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}