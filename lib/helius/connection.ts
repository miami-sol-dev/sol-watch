import { Connection, PublicKey } from '@solana/web3.js';

// Your Helius Pro RPC endpoint from .env.local
const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;

if (!HELIUS_RPC_URL) {
  console.warn('⚠️ NEXT_PUBLIC_HELIUS_RPC_URL not found in environment variables');
}

// Create a single connection instance
export const heliusConnection = new Connection(
  HELIUS_RPC_URL || 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY',
  'confirmed'
);

/**
 * Get current Solana network status
 */
export async function getNetworkStatus() {
  const slot = await heliusConnection.getSlot();
  const blockHeight = await heliusConnection.getBlockHeight();
  const version = await heliusConnection.getVersion();
  
  return {
    slot,
    blockHeight,
    version,
    timestamp: Date.now(),
  };
}

/**
 * Get SOL balance for an address
 */
export async function getSolBalance(address: string | PublicKey) {
  const pubkey = typeof address === 'string' ? new PublicKey(address) : address;
  const balance = await heliusConnection.getBalance(pubkey);
  return balance / 1e9; // Convert lamports to SOL
}

/**
 * Get token accounts for an address
 */
export async function getTokenAccounts(address: string | PublicKey) {
  const pubkey = typeof address === 'string' ? new PublicKey(address) : address;
  const accounts = await heliusConnection.getParsedTokenAccountsByOwner(pubkey, {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program
  });
  
  return accounts.value.map(account => ({
    mint: account.account.data.parsed.info.mint,
    owner: account.account.data.parsed.info.owner,
    tokenAmount: account.account.data.parsed.info.tokenAmount,
  }));
}

/**
 * Check if Helius connection is working
 */
export async function checkHeliusHealth() {
  try {
    const slot = await heliusConnection.getSlot();
    return {
      healthy: true,
      slot,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Connection failed',
      timestamp: Date.now(),
    };
  }
}

/**
 * Get recent performance samples
 */
export async function getPerformanceInfo() {
  const samples = await heliusConnection.getRecentPerformanceSamples(1);
  if (samples.length === 0) return null;
  
  const sample = samples[0];
  return {
    numTransactions: sample.numTransactions,
    numSlots: sample.numSlots,
    samplePeriodSecs: sample.samplePeriodSecs,
    tps: sample.numTransactions / sample.samplePeriodSecs,
  };
}