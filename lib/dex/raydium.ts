import { connection } from '../solana/connection';
import { DexPrice } from '@/types/dex';
import { PublicKey } from '@solana/web3.js';

// USDC mint address (default quote token)
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// Raydium program IDs
const RAYDIUM_LIQUIDITY_POOL_V4 = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';

interface RaydiumPoolInfo {
  ammId: string;
  baseMint: string;
  quoteMint: string;
  baseReserve: number;
  quoteReserve: number;
  lpSupply: number;
  feeRate: number;
}

/**
 * Get price from Raydium DEX
 * @param tokenMint - Token mint address
 * @param quoteMint - Quote token mint (default: USDC)
 * @returns Price data from Raydium
 */
export async function getRaydiumPrice(
  tokenMint: string,
  quoteMint: string = USDC_MINT
): Promise<DexPrice> {
  try {
    const poolInfo = await fetchRaydiumPoolInfo(tokenMint, quoteMint);
    
    if (!poolInfo) {
      throw new Error('Pool not found');
    }

    // Calculate price from reserves (AMM formula: price = quoteReserve / baseReserve)
    const price = poolInfo.quoteReserve / poolInfo.baseReserve;
    
    // Calculate liquidity (in USD terms)
    const liquidity = poolInfo.quoteReserve * 2; // Approximate TVL

    return {
      dex: 'Raydium',
      price,
      liquidity,
      fee: poolInfo.feeRate,
      timestamp: Date.now(),
      poolAddress: poolInfo.ammId,
    };
  } catch (error) {
    console.error('Raydium price fetch error:', error);
    throw new Error(`Raydium: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch pool info using Raydium SDK v2
 */
async function fetchRaydiumPoolInfo(
  tokenMint: string,
  quoteMint: string
): Promise<RaydiumPoolInfo | null> {
  try {
    const { Raydium } = await import('@raydium-io/raydium-sdk-v2');
    
    // Initialize Raydium
    const raydium = await Raydium.load({
      connection,
      cluster: 'mainnet',
      disableLoadToken: true, // We don't need token list
    });

    // Create PublicKey instances
    const baseMint = new PublicKey(tokenMint);
    const quoteMintPk = new PublicKey(quoteMint);

    // Fetch pool by mints - this is the correct v2 API
    const res = await raydium.api.fetchPoolByMints({
      mint1: baseMint,
      mint2: quoteMintPk,
    });

    if (!res || res.length === 0) {
      return null;
    }

    // Get the first pool (usually the most liquid)
    const pool = res[0];

    // Fetch pool keys to get reserve data
    const poolKeys = await raydium.liquidity.getPoolKeys(pool.id);
    
    if (!poolKeys) {
      return null;
    }

    // Fetch current pool info with reserves
    const poolInfo = await raydium.liquidity.fetchInfo({ poolKeys });

    return {
      ammId: pool.id,
      baseMint: poolInfo.mintA.address.toString(),
      quoteMint: poolInfo.mintB.address.toString(),
      baseReserve: Number(poolInfo.baseReserve) / Math.pow(10, poolInfo.mintA.decimals),
      quoteReserve: Number(poolInfo.quoteReserve) / Math.pow(10, poolInfo.mintB.decimals),
      lpSupply: Number(poolInfo.lpSupply) / 1e9,
      feeRate: 0.0025, // Raydium standard fee: 0.25%
    };
  } catch (error) {
    console.error('Raydium pool fetch error:', error);
    return null;
  }
}

/**
 * Get multiple prices from Raydium
 */
export async function getRaydiumPrices(
  tokenMints: string[],
  quoteMint: string = USDC_MINT
): Promise<Map<string, DexPrice>> {
  const results = new Map<string, DexPrice>();

  await Promise.allSettled(
    tokenMints.map(async (mint) => {
      try {
        const price = await getRaydiumPrice(mint, quoteMint);
        results.set(mint, price);
      } catch (error) {
        console.error(`Failed to get Raydium price for ${mint}:`, error);
      }
    })
  );

  return results;
}

/**
 * Check if Raydium is available and responding
 */
export async function checkRaydiumHealth(): Promise<boolean> {
  try {
    const programId = new PublicKey(RAYDIUM_LIQUIDITY_POOL_V4);
    const accountInfo = await connection.getAccountInfo(programId);
    return accountInfo !== null;
  } catch (error) {
    console.error('Raydium health check failed:', error);
    return false;
  }
}