export interface DexPrice {
    dex: 'Raydium' | 'Orca' | 'Jupiter';
    price: number;
    liquidity: number;
    fee: number;
    timestamp: number;
    poolAddress?: string;
  }
  
  export interface TokenPair {
    tokenA: string; // Mint address
    tokenB: string; // Mint address (usually USDC)
  }
  
  export interface PoolInfo {
    address: string;
    tokenA: string;
    tokenB: string;
    reserveA: number;
    reserveB: number;
    fee: number;
    liquidity: number;
  }
  
  export interface ArbitrageOpportunity {
    tokenSymbol: string;
    tokenMint: string;
    tokenName: string;
    buyDex: string;
    buyPrice: number;
    buyLiquidity: number;
    sellDex: string;
    sellPrice: number;
    sellLiquidity: number;
    spread: number;
    spreadPercent: number;
    estimatedProfit: number;
    estimatedProfitPercent: number;
    minLiquidity: number;
    timestamp: number;
    confidence: 'high' | 'medium' | 'low';
  }
  
  export interface DexError {
    dex: string;
    error: string;
    timestamp: number;
  }
