import React from 'react';
import { FileText } from 'lucide-react';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Description</label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the goods or services being exchanged"
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-violet-500 transition-colors min-h-[100px] resize-y"
        />
        <FileText className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        Provide a clear and detailed description of the transaction
      </p>
    </div>
  );
}