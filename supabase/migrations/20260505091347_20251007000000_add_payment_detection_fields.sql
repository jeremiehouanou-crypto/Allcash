/*
  # Add Payment Detection Fields

  1. Changes to operations table
    - Add `payment_detected` (boolean) - Auto payment detection status
    - Add `payment_received` (boolean) - Manual confirmation by admin
    - Add `deposit_address` (text) - Address where user should send payment
    - Add `transaction_hash` (text) - Blockchain transaction hash once detected

  2. Changes to all operation tables
    - Add payment tracking fields for better monitoring

  3. Security
    - Maintain existing RLS policies
    - These fields allow admins to manually confirm payments

  4. Notes
    - `payment_detected` starts as false, changes to true when payment is detected
    - `payment_received` can be manually set to true by admin
    - When `payment_received` is true, status should update to 'processing' or 'completed'
*/

-- Add payment detection fields to operations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operations' AND column_name = 'payment_detected'
  ) THEN
    ALTER TABLE operations ADD COLUMN payment_detected boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operations' AND column_name = 'payment_received'
  ) THEN
    ALTER TABLE operations ADD COLUMN payment_received boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operations' AND column_name = 'deposit_address'
  ) THEN
    ALTER TABLE operations ADD COLUMN deposit_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operations' AND column_name = 'transaction_hash'
  ) THEN
    ALTER TABLE operations ADD COLUMN transaction_hash text;
  END IF;
END $$;

-- Create function to update status when payment is received
CREATE OR REPLACE FUNCTION update_status_on_payment_received()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_received = true AND OLD.payment_received = false THEN
    NEW.status = 'processing';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment received
DROP TRIGGER IF EXISTS payment_received_status_update ON operations;
CREATE TRIGGER payment_received_status_update
  BEFORE UPDATE ON operations
  FOR EACH ROW
  WHEN (NEW.payment_received = true AND OLD.payment_received = false)
  EXECUTE FUNCTION update_status_on_payment_received();

-- Create index for payment detection queries
CREATE INDEX IF NOT EXISTS idx_operations_payment_detected ON operations(payment_detected);
CREATE INDEX IF NOT EXISTS idx_operations_payment_received ON operations(payment_received);
