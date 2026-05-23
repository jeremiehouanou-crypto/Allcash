import Web3 from 'web3';

export class BlockchainMonitor {
  private web3: Web3;
  private checkInterval: number = 30000; // 30 seconds
  private intervalId?: NodeJS.Timeout;

  constructor() {
    // Use a public node for monitoring
    this.web3 = new Web3('https://cloudflare-eth.com');
  }

  async checkTransaction(address: string, callback: (confirmed: boolean) => void) {
    try {
      // Validate address format
      if (!this.web3.utils.isAddress(address)) {
        console.warn('Invalid Ethereum address format');
        callback(false);
        return;
      }

      const balance = await this.web3.eth.getBalance(address);
      const hasBalance = BigInt(balance) > BigInt(0);
      callback(hasBalance);
    } catch (error) {
      console.warn('Error checking transaction:', error);
      // Don't throw error, just report false
      callback(false);
    }
  }

  startMonitoring(address: string, callback: (confirmed: boolean) => void) {
    // Initial check
    this.checkTransaction(address, callback);

    // Set up interval for subsequent checks
    this.intervalId = setInterval(() => {
      this.checkTransaction(address, callback);
    }, this.checkInterval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const getTransactionStatus = async (txHash: string): Promise<'pending' | 'confirmed' | 'failed'> => {
  try {
    const web3 = new Web3('https://cloudflare-eth.com');
    
    if (!web3.utils.isHexStrict(txHash)) {
      console.warn('Invalid transaction hash format');
      return 'pending';
    }

    const tx = await web3.eth.getTransaction(txHash);
    
    if (!tx) return 'pending';
    
    const currentBlock = await web3.eth.getBlockNumber();
    const confirmations = tx.blockNumber ? currentBlock - tx.blockNumber : 0;
    
    if (confirmations >= 6) return 'confirmed';
    if (confirmations > 0) return 'pending';
    return 'failed';
  } catch (error) {
    console.warn('Error getting transaction status:', error);
    return 'pending';
  }
};