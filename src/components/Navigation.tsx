import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64;
      const targetPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <div className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => scrollToSection('swap')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Instant Swap
        </button>
        <button
          onClick={() => scrollToSection('escrow')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Escrow Payment
        </button>
        <button
          onClick={() => scrollToSection('withdrawal')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Cash Withdrawal
        </button>
        <button
          onClick={() => scrollToSection('paypal')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          PayPal Withdrawal
        </button>
        <button
          onClick={() => scrollToSection('track')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Track Operation
        </button>
      </div>

      <div className="md:hidden relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-lg z-50">
            <button
              onClick={() => scrollToSection('swap')}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors"
            >
              Instant Swap
            </button>
            <button
              onClick={() => scrollToSection('escrow')}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors"
            >
              Escrow Payment
            </button>
            <button
              onClick={() => scrollToSection('withdrawal')}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors"
            >
              Cash Withdrawal
            </button>
            <button
              onClick={() => scrollToSection('paypal')}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors"
            >
              PayPal Withdrawal
            </button>
            <button
              onClick={() => scrollToSection('track')}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors rounded-b-xl"
            >
              Track Operation
            </button>
          </div>
        )}
      </div>
    </>
  );
}