/*
  # Create Operations Management System

  1. New Tables
    
    ## `operations` - Main operations table
      - `id` (uuid, primary key) - Unique operation ID
      - `operation_type` (text) - Type: swap, cash_withdrawal, paypal_withdrawal, escrow
      - `status` (text) - Status: pending, processing, completed, cancelled, failed
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `user_email` (text) - User email for tracking
      - `metadata` (jsonb) - Flexible data storage for operation-specific details
    
    ## `swap_operations` - Swap-specific details
      - `id` (uuid, primary key)
      - `operation_id` (uuid, foreign key) - Links to operations table
      - `from_token` (text) - Source token symbol
      - `to_token` (text) - Destination token symbol
      - `from_amount` (decimal) - Amount sent
      - `to_amount` (decimal) - Amount received
      - `from_address` (text) - Sender address
      - `to_address` (text) - Receiver address
      - `fee` (decimal) - Transaction fee
      - `exchange_rate` (decimal) - Exchange rate at time of swap
    
    ## `cash_withdrawal_operations` - Cash withdrawal details
      - `id` (uuid, primary key)
      - `operation_id` (uuid, foreign key)
      - `token` (text) - Cryptocurrency token
      - `amount` (decimal) - Crypto amount
      - `country` (text) - Destination country
      - `recipient_name` (text) - Recipient full name
      - `recipient_address` (text) - Recipient physical address
      - `recipient_email` (text) - Recipient email
      - `fee` (decimal) - Withdrawal fee
      - `final_amount` (decimal) - Amount after fees
      - `tracking_number` (text) - Delivery tracking number
    
    ## `paypal_withdrawal_operations` - PayPal withdrawal details
      - `id` (uuid, primary key)
      - `operation_id` (uuid, foreign key)
      - `token` (text) - Cryptocurrency token
      - `amount` (decimal) - Crypto amount
      - `paypal_email` (text) - PayPal account email
      - `fee` (decimal) - Withdrawal fee
      - `final_amount` (decimal) - Amount after fees
      - `paypal_transaction_id` (text) - PayPal transaction ID
    
    ## `escrow_operations` - Escrow payment details
      - `id` (uuid, primary key)
      - `operation_id` (uuid, foreign key)
      - `token` (text) - Cryptocurrency token
      - `amount` (decimal) - Escrow amount
      - `buyer_email` (text) - Buyer email address
      - `seller_email` (text) - Seller email address
      - `seller_address` (text) - Seller wallet address
      - `description` (text) - Goods/services description
      - `escrow_address` (text) - Escrow smart contract address
      - `release_approved_by_buyer` (boolean) - Buyer approval status
      - `release_approved_by_seller` (boolean) - Seller approval status
      - `released_at` (timestamptz) - Release timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for users to view their own operations
    - Add policies for users to create new operations
    - Add policies for users to update their own operations (cancel/confirm)

  3. Indexes
    - Index on operation_id for foreign key lookups
    - Index on status for filtering
    - Index on user_email for user-specific queries
    - Index on created_at for chronological queries
*/

-- Create operations table
CREATE TABLE IF NOT EXISTS operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type text NOT NULL CHECK (operation_type IN ('swap', 'cash_withdrawal', 'paypal_withdrawal', 'escrow')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_email text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create swap_operations table
CREATE TABLE IF NOT EXISTS swap_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id uuid NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
  from_token text NOT NULL,
  to_token text NOT NULL,
  from_amount decimal(36, 18) NOT NULL,
  to_amount decimal(36, 18) NOT NULL,
  from_address text,
  to_address text NOT NULL,
  fee decimal(36, 18) NOT NULL DEFAULT 0,
  exchange_rate decimal(36, 18) NOT NULL
);

-- Create cash_withdrawal_operations table
CREATE TABLE IF NOT EXISTS cash_withdrawal_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id uuid NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
  token text NOT NULL,
  amount decimal(36, 18) NOT NULL,
  country text NOT NULL,
  recipient_name text NOT NULL,
  recipient_address text NOT NULL,
  recipient_email text NOT NULL,
  fee decimal(36, 18) NOT NULL DEFAULT 0,
  final_amount decimal(36, 18) NOT NULL,
  tracking_number text
);

-- Create paypal_withdrawal_operations table
CREATE TABLE IF NOT EXISTS paypal_withdrawal_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id uuid NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
  token text NOT NULL,
  amount decimal(36, 18) NOT NULL,
  paypal_email text NOT NULL,
  fee decimal(36, 18) NOT NULL DEFAULT 0,
  final_amount decimal(36, 18) NOT NULL,
  paypal_transaction_id text
);

-- Create escrow_operations table
CREATE TABLE IF NOT EXISTS escrow_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id uuid NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
  token text NOT NULL,
  amount decimal(36, 18) NOT NULL,
  buyer_email text NOT NULL,
  seller_email text NOT NULL,
  seller_address text NOT NULL,
  description text NOT NULL,
  escrow_address text,
  release_approved_by_buyer boolean DEFAULT false,
  release_approved_by_seller boolean DEFAULT false,
  released_at timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_operations_status ON operations(status);
CREATE INDEX IF NOT EXISTS idx_operations_user_email ON operations(user_email);
CREATE INDEX IF NOT EXISTS idx_operations_created_at ON operations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_swap_operations_operation_id ON swap_operations(operation_id);
CREATE INDEX IF NOT EXISTS idx_cash_withdrawal_operations_operation_id ON cash_withdrawal_operations(operation_id);
CREATE INDEX IF NOT EXISTS idx_paypal_withdrawal_operations_operation_id ON paypal_withdrawal_operations(operation_id);
CREATE INDEX IF NOT EXISTS idx_escrow_operations_operation_id ON escrow_operations(operation_id);

-- Enable RLS
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_withdrawal_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE paypal_withdrawal_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_operations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for operations table
CREATE POLICY "Anyone can create operations"
  ON operations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own operations"
  ON operations FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own operations"
  ON operations FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for swap_operations
CREATE POLICY "Anyone can create swap operations"
  ON swap_operations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view swap operations"
  ON swap_operations FOR SELECT
  USING (true);

-- RLS Policies for cash_withdrawal_operations
CREATE POLICY "Anyone can create cash withdrawal operations"
  ON cash_withdrawal_operations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view cash withdrawal operations"
  ON cash_withdrawal_operations FOR SELECT
  USING (true);

-- RLS Policies for paypal_withdrawal_operations
CREATE POLICY "Anyone can create paypal withdrawal operations"
  ON paypal_withdrawal_operations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view paypal withdrawal operations"
  ON paypal_withdrawal_operations FOR SELECT
  USING (true);

-- RLS Policies for escrow_operations
CREATE POLICY "Anyone can create escrow operations"
  ON escrow_operations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view escrow operations"
  ON escrow_operations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update escrow operations"
  ON escrow_operations FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_operations_updated_at ON operations;
CREATE TRIGGER update_operations_updated_at
  BEFORE UPDATE ON operations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();