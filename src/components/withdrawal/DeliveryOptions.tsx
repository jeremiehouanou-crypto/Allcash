import React from 'react';
import { Clock, Zap, Truck } from 'lucide-react';
import { calculateDeliveryWindow, formatDeliveryTime } from '../../utils/dates';
import { calculateWithdrawalFee } from '../../utils/fees';
import { CryptoToken } from '../../types/crypto';

interface DeliveryOptionsProps {
  priority: 'standard' | 'express' | 'instant';
  onChange: (priority: 'standard' | 'express' | 'instant') => void;
  amount: number;
  token: CryptoToken;
}

export default function DeliveryOptions({
  priority,
  onChange,
  amount,
  token
}: DeliveryOptionsProps) {
  const options = [
    {
      id: 'standard',
      name: 'Standard',
      icon: Truck,
      description: '2-4 business days',
      fee: calculateWithdrawalFee(amount, token, 'standard').fee,
    },
    {
      id: 'express',
      name: 'Express',
      icon: Clock,
      description: '1-2 business days',
      fee: calculateWithdrawalFee(amount, token, 'express').fee,
    },
    {
      id: 'instant',
      name: 'Instant',
      icon: Zap,
      description: '1-4 hours',
      fee: calculateWithdrawalFee(amount, token, 'instant').fee,
    },
  ];

  return (
    <div className="mt-6">
      <label className="block text-sm text-gray-400 mb-2">Delivery Speed</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => {
          const { earliest, latest } = calculateDeliveryWindow(option.id as any);
          const Icon = option.icon;
          
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id as any)}
              className={`flex flex-col p-4 rounded-xl border transition-colors ${
                priority === option.id
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-slate-700 bg-slate-900/50 hover:border-violet-500/50'
              }`}
            >
              <div className="flex items-center mb-2">
                <Icon className={`w-5 h-5 ${
                  priority === option.id ? 'text-violet-400' : 'text-gray-400'
                }`} />
                <span className="ml-2 font-medium">{option.name}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{option.description}</p>
              <div className="text-xs text-gray-500">
                Estimated delivery:
                <br />
                {formatDeliveryTime(earliest)} - {formatDeliveryTime(latest)}
              </div>
              <div className="mt-2 text-sm font-medium text-violet-400">
                +{((option.fee / amount) * 100).toFixed(1)}% fee
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}