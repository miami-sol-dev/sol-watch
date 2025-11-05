import { DexPrice } from '@/types/dex';

const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';

interface JupiterPriceResponse {
  data: {
    [mint: string]: {
      id: string;
      mintSymbol?: string;
      vsToken?: string;
      vsTokenSymbol?: string;
      price: number;
    };
  };
  timeTaken?: number;
}

/**
 * Fetch prices from Jupiter (aggregates Raydium, Orca, and other DEXs)
 * This is a temporary solution that works reliably
 */
export async function getJupiterPrices(tokenMints: string[]): Promise<Map<string, DexPrice>> {
  const results = new Map<string, DexPrice>();
  
  try {
    const ids = tokenMints.join(',');
    const response = await fetch(`${JUPITER_PRICE_API}?ids=${ids}`);
    
    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`);
    }
    
    const data: JupiterPriceResponse = await response.json();
    
    // Convert Jupiter prices to our DexPrice format
    for (const [mint, priceData] of Object.entries(data.data)) {
      results.set(mint, {
        dex: 'Jupiter', // Jupiter aggregates multiple DEXs
        price: typeof priceData.price === 'number' ? priceData.price : parseFloat(priceData.price as any),
        liquidity: 1000000, // Jupiter doesn't provide liquidity, use placeholder
        fee: 0.003, // Average DEX fee estimate
        timestamp: Date.now(),
      });
    }
    
    return results;
  } catch (error) {
    console.error('Jupiter price fetch error:', error);
    return results;
  }
}

/**
 * Get a single token price from Jupiter
 */
export async function getJupiterPrice(tokenMint: string): Promise<DexPrice> {
  const prices = await getJupiterPrices([tokenMint]);
  const price = prices.get(tokenMint);
  
  if (!price) {
    throw new Error('Price not found');
  }
  
  return price;
}