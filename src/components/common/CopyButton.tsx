import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  variant?: 'default' | 'compact';
  label?: string;
}

export default function CopyButton({ text, variant = 'default', label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-slate-700/50 rounded transition-colors"
        title={label}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
        copied 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
      }`}
    >
      {copied ? (
        <Check className="w-4 h-4 mr-1" />
      ) : (
        <Copy className="w-4 h-4 mr-1" />
      )}
      <span className="text-sm">{copied ? 'Copied!' : label}</span>
    </button>
  );
}