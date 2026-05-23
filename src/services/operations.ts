import { supabase, Operation, SwapOperation, CashWithdrawalOperation, PaypalWithdrawalOperation, EscrowOperation, OperationType, OperationStatus } from '../lib/supabase';

export interface CreateSwapOperationData {
  userEmail: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  fromAddress: string | null;
  toAddress: string;
  fee: number;
  exchangeRate: number;
  depositAddress: string;
}

export interface CreateCashWithdrawalData {
  userEmail: string;
  token: string;
  amount: number;
  country: string;
  recipientName: string;
  recipientAddress: string;
  recipientEmail: string;
  fee: number;
  finalAmount: number;
}

export interface CreatePaypalWithdrawalData {
  userEmail: string;
  token: string;
  amount: number;
  paypalEmail: string;
  fee: number;
  finalAmount: number;
}

export interface CreateEscrowData {
  userEmail: string;
  token: string;
  amount: number;
  buyerEmail: string;
  sellerEmail: string;
  sellerAddress: string;
  description: string;
}

export async function createSwapOperation(data: CreateSwapOperationData): Promise<string> {
  const { data: operation, error: operationError } = await supabase
    .from('operations')
    .insert({
      operation_type: 'swap',
      status: 'pending',
      user_email: data.userEmail,
      deposit_address: data.depositAddress,
      payment_detected: false,
      payment_received: false,
      metadata: {
        from_token: data.fromToken,
        to_token: data.toToken,
      }
    })
    .select()
    .single();

  if (operationError) throw operationError;

  const { error: swapError } = await supabase
    .from('swap_operations')
    .insert({
      operation_id: operation.id,
      from_token: data.fromToken,
      to_token: data.toToken,
      from_amount: data.fromAmount,
      to_amount: data.toAmount,
      from_address: data.fromAddress,
      to_address: data.toAddress,
      fee: data.fee,
      exchange_rate: data.exchangeRate,
    });

  if (swapError) throw swapError;

  return operation.id;
}

export async function createCashWithdrawalOperation(data: CreateCashWithdrawalData): Promise<string> {
  const { data: operation, error: operationError } = await supabase
    .from('operations')
    .insert({
      operation_type: 'cash_withdrawal',
      status: 'pending',
      user_email: data.userEmail,
      metadata: {
        token: data.token,
        country: data.country,
      }
    })
    .select()
    .single();

  if (operationError) throw operationError;

  const { error: cashError } = await supabase
    .from('cash_withdrawal_operations')
    .insert({
      operation_id: operation.id,
      token: data.token,
      amount: data.amount,
      country: data.country,
      recipient_name: data.recipientName,
      recipient_address: data.recipientAddress,
      recipient_email: data.recipientEmail,
      fee: data.fee,
      final_amount: data.finalAmount,
    });

  if (cashError) throw cashError;

  return operation.id;
}

export async function createPaypalWithdrawalOperation(data: CreatePaypalWithdrawalData): Promise<string> {
  const { data: operation, error: operationError } = await supabase
    .from('operations')
    .insert({
      operation_type: 'paypal_withdrawal',
      status: 'pending',
      user_email: data.userEmail,
      metadata: {
        token: data.token,
      }
    })
    .select()
    .single();

  if (operationError) throw operationError;

  const { error: paypalError } = await supabase
    .from('paypal_withdrawal_operations')
    .insert({
      operation_id: operation.id,
      token: data.token,
      amount: data.amount,
      paypal_email: data.paypalEmail,
      fee: data.fee,
      final_amount: data.finalAmount,
    });

  if (paypalError) throw paypalError;

  return operation.id;
}

export async function createEscrowOperation(data: CreateEscrowData): Promise<string> {
  const { data: operation, error: operationError } = await supabase
    .from('operations')
    .insert({
      operation_type: 'escrow',
      status: 'pending',
      user_email: data.userEmail,
      metadata: {
        token: data.token,
        buyer_email: data.buyerEmail,
        seller_email: data.sellerEmail,
      }
    })
    .select()
    .single();

  if (operationError) throw operationError;

  const { error: escrowError } = await supabase
    .from('escrow_operations')
    .insert({
      operation_id: operation.id,
      token: data.token,
      amount: data.amount,
      buyer_email: data.buyerEmail,
      seller_email: data.sellerEmail,
      seller_address: data.sellerAddress,
      description: data.description,
    });

  if (escrowError) throw escrowError;

  return operation.id;
}

export async function getOperationById(operationId: string) {
  const { data: operation, error: operationError } = await supabase
    .from('operations')
    .select('*')
    .eq('id', operationId)
    .maybeSingle();

  if (operationError) throw operationError;
  if (!operation) return null;

  let details = null;

  switch (operation.operation_type) {
    case 'swap':
      const { data: swapData } = await supabase
        .from('swap_operations')
        .select('*')
        .eq('operation_id', operationId)
        .maybeSingle();
      details = swapData;
      break;
    case 'cash_withdrawal':
      const { data: cashData } = await supabase
        .from('cash_withdrawal_operations')
        .select('*')
        .eq('operation_id', operationId)
        .maybeSingle();
      details = cashData;
      break;
    case 'paypal_withdrawal':
      const { data: paypalData } = await supabase
        .from('paypal_withdrawal_operations')
        .select('*')
        .eq('operation_id', operationId)
        .maybeSingle();
      details = paypalData;
      break;
    case 'escrow':
      const { data: escrowData } = await supabase
        .from('escrow_operations')
        .select('*')
        .eq('operation_id', operationId)
        .maybeSingle();
      details = escrowData;
      break;
  }

  return { operation, details };
}

export async function updateOperationStatus(operationId: string, status: OperationStatus) {
  const { error } = await supabase
    .from('operations')
    .update({ status })
    .eq('id', operationId);

  if (error) throw error;
}

export async function cancelOperation(operationId: string) {
  return updateOperationStatus(operationId, 'cancelled');
}

export async function approveEscrowRelease(operationId: string, approver: 'buyer' | 'seller') {
  const { data: escrowOp, error: fetchError } = await supabase
    .from('escrow_operations')
    .select('*')
    .eq('operation_id', operationId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!escrowOp) throw new Error('Escrow operation not found');

  const updateData: any = {};

  if (approver === 'buyer') {
    updateData.release_approved_by_buyer = true;
  } else {
    updateData.release_approved_by_seller = true;
  }

  const bothApproved =
    (approver === 'buyer' && escrowOp.release_approved_by_seller) ||
    (approver === 'seller' && escrowOp.release_approved_by_buyer);

  if (bothApproved) {
    updateData.released_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase
    .from('escrow_operations')
    .update(updateData)
    .eq('operation_id', operationId);

  if (updateError) throw updateError;

  if (bothApproved) {
    await updateOperationStatus(operationId, 'completed');
  }
}

export async function getAllOperations(userEmail?: string) {
  let query = supabase
    .from('operations')
    .select('*')
    .order('created_at', { ascending: false });

  if (userEmail) {
    query = query.eq('user_email', userEmail);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
