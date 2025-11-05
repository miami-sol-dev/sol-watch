import { Connection, ConnectionConfig } from '@solana/web3.js';

const RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';

const connectionConfig: ConnectionConfig = {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
};

// Singleton connection instance
let connectionInstance: Connection | null = null;

export function getConnection(): Connection {
  if (!connectionInstance) {
    connectionInstance = new Connection(RPC_URL, connectionConfig);
  }
  return connectionInstance;
}

export const connection = getConnection();

// Utility to check connection health
export async function checkConnectionHealth(): Promise<boolean> {
  try {
    const slot = await connection.getSlot();
    return slot > 0;
  } catch (error) {
    console.error('Connection health check failed:', error);
    return false;
  }
}

// Get network info
export function getNetworkInfo() {
  return {
    network: NETWORK,
    rpcUrl: RPC_URL.replace(/\?api-key=.*$/, ''), // Hide API key
    commitment: connectionConfig.commitment,
  };
}