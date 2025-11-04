export interface Token {
    symbol: string;
    name: string;
    coingeckoId: string;
    mint?: string; // We'll use this later for Jupiter
  }
  
  export const TOKENS: Token[] = [
    {
      symbol: 'SOL',
      name: 'Solana',
      coingeckoId: 'solana',
      mint: 'So11111111111111111111111111111111111111112',
    },
    {
      symbol: 'BONK',
      name: 'Bonk',
      coingeckoId: 'bonk',
      mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    },
    {
      symbol: 'JUP',
      name: 'Jupiter',
      coingeckoId: 'jupiter-exchange-solana',
      mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    },
    {
      symbol: 'WIF',
      name: 'dogwifhat',
      coingeckoId: 'dogwifcoin',
      mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      coingeckoId: 'usd-coin',
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    },
  ];