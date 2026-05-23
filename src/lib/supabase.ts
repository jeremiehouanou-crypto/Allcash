import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type OperationType = 'swap' | 'cash_withdrawal' | 'paypal_withdrawal' | 'escrow';
export type OperationStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';

export interface Operation {
  id: string;
  operation_type: OperationType;
  status: OperationStatus;
  created_at: string;
  updated_at: string;
  user_email: string;
  metadata: Record<string, any>;
  payment_detected: boolean;
  payment_received: boolean;
  deposit_address: string | null;
  transaction_hash: string | null;
}

export interface SwapOperation {
  id: string;
  operation_id: string;
  from_token: string;
  to_token: string;
  from_amount: number;
  to_amount: number;
  from_address: string | null;
  to_address: string;
  fee: number;
  exchange_rate: number;
}

export interface CashWithdrawalOperation {
  id: string;
  operation_id: string;
  token: string;
  amount: number;
  country: string;
  recipient_name: string;
  recipient_address: string;
  recipient_email: string;
  fee: number;
  final_amount: number;
  tracking_number: string | null;
}

export interface PaypalWithdrawalOperation {
  id: string;
  operation_id: string;
  token: string;
  amount: number;
  paypal_email: string;
  fee: number;
  final_amount: number;
  paypal_transaction_id: string | null;
}

export interface EscrowOperation {
  id: string;
  operation_id: string;
  token: string;
  amount: number;
  buyer_email: string;
  seller_email: string;
  seller_address: string;
  description: string;
  escrow_address: string | null;
  release_approved_by_buyer: boolean;
  release_approved_by_seller: boolean;
  released_at: string | null;
}
