import React, { useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getOperationById, cancelOperation, updateOperationStatus, approveEscrowRelease } from '../services/operations';

interface OperationDetails {
  operation: any;
  details: any;
}

export default function TrackOperation() {
  const [operationId, setOperationId] = useState('');
  const [operationData, setOperationData] = useState<OperationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!operationId.trim()) {
      setError('Please enter an operation ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getOperationById(operationId.trim());

      if (!data) {
        setError('Operation not found');
        setOperationData(null);
      } else {
        setOperationData(data);
      }
    } catch (err) {
      console.error('Error fetching operation:', err);
      setError('Failed to fetch operation details');
      setOperationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!operationData) return;

    if (!confirm('Are you sure you want to cancel this operation?')) {
      return;
    }

    try {
      await cancelOperation(operationData.operation.id);
      alert('Operation cancelled successfully');
      handleSearch(new Event('submit') as any);
    } catch (err) {
      console.error('Error cancelling operation:', err);
      alert('Failed to cancel operation');
    }
  };

  const handleEscrowApproval = async (approver: 'buyer' | 'seller') => {
    if (!operationData) return;

    if (!confirm(`Confirm release approval as ${approver}?`)) {
      return;
    }

    try {
      await approveEscrowRelease(operationData.operation.id, approver);
      alert('Approval recorded successfully');
      handleSearch(new Event('submit') as any);
    } catch (err) {
      console.error('Error approving escrow release:', err);
      alert('Failed to approve release');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case 'processing':
        return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      case 'cancelled':
        return 'text-red-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderOperationDetails = () => {
    if (!operationData) return null;

    const { operation, details } = operationData;

    return (
      <div className="mt-6 space-y-4">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {getStatusIcon(operation.status)}
              <div className="ml-3">
                <h3 className="text-lg font-bold capitalize">
                  {operation.operation_type.replace('_', ' ')}
                </h3>
                <p className={`text-sm ${getStatusColor(operation.status)} capitalize`}>
                  Status: {operation.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Created</p>
              <p className="text-sm">{new Date(operation.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Operation ID</h4>
            <p className="font-mono text-sm break-all">{operation.id}</p>
          </div>

          {operation.operation_type === 'swap' && details && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">From</p>
                  <p className="text-sm font-semibold">
                    {details.from_amount} {details.from_token}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">To</p>
                  <p className="text-sm font-semibold">
                    {details.to_amount} {details.to_token}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Receiving Address</p>
                <p className="text-sm font-mono break-all">{details.to_address}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fee</p>
                <p className="text-sm">{details.fee} {details.from_token}</p>
              </div>
            </div>
          )}

          {operation.operation_type === 'cash_withdrawal' && details && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="text-sm font-semibold">
                    {details.amount} {details.token}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Final Amount</p>
                  <p className="text-sm font-semibold text-green-400">
                    {details.final_amount} {details.token}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Recipient</p>
                <p className="text-sm">{details.recipient_name}</p>
                <p className="text-xs text-gray-500">{details.recipient_email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Country</p>
                <p className="text-sm">{details.country}</p>
              </div>
              {details.tracking_number && (
                <div>
                  <p className="text-xs text-gray-400">Tracking Number</p>
                  <p className="text-sm font-mono">{details.tracking_number}</p>
                </div>
              )}
            </div>
          )}

          {operation.operation_type === 'paypal_withdrawal' && details && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="text-sm font-semibold">
                    {details.amount} {details.token}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Final Amount</p>
                  <p className="text-sm font-semibold text-green-400">
                    {details.final_amount} {details.token}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">PayPal Email</p>
                <p className="text-sm font-mono">{details.paypal_email}</p>
              </div>
              {details.paypal_transaction_id && (
                <div>
                  <p className="text-xs text-gray-400">PayPal Transaction ID</p>
                  <p className="text-sm font-mono">{details.paypal_transaction_id}</p>
                </div>
              )}
            </div>
          )}

          {operation.operation_type === 'escrow' && details && (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Amount</p>
                <p className="text-sm font-semibold">
                  {details.amount} {details.token}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Buyer Email</p>
                  <p className="text-sm font-mono text-xs">{details.buyer_email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Seller Email</p>
                  <p className="text-sm font-mono text-xs">{details.seller_email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Seller Address</p>
                <p className="text-sm font-mono break-all">{details.seller_address}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Description</p>
                <p className="text-sm">{details.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Buyer Approval</p>
                  <p className={`text-sm font-semibold ${details.release_approved_by_buyer ? 'text-green-400' : 'text-yellow-400'}`}>
                    {details.release_approved_by_buyer ? 'Approved' : 'Pending'}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Seller Approval</p>
                  <p className={`text-sm font-semibold ${details.release_approved_by_seller ? 'text-green-400' : 'text-yellow-400'}`}>
                    {details.release_approved_by_seller ? 'Approved' : 'Pending'}
                  </p>
                </div>
              </div>
              {details.released_at && (
                <div>
                  <p className="text-xs text-gray-400">Released At</p>
                  <p className="text-sm">{new Date(details.released_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {operation.status === 'pending' && operation.operation_type !== 'escrow' && (
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors"
            >
              Cancel Operation
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center mb-6">
          <Search className="w-6 h-6 text-blue-400 mr-2" />
          <h2 className="text-xl font-bold">Track Operation</h2>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Operation ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={operationId}
                onChange={(e) => setOperationId(e.target.value)}
                placeholder="Enter your operation ID"
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {renderOperationDetails()}
      </div>
    </div>
  );
}
