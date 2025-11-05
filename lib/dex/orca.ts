import { connection } from '../solana/connection';
import { DexPrice } from '@/types/dex';
import { PublicKey } from '@solana/web3.js';

// USDC mint address (default quote token)
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// Orca Whirlpool program ID
const ORCA_WHIRLPOOL_PROGRAM_ID = 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc';

interface OrcaPoolInfo {
  address: string;
  tokenA: string;
  tokenB: string;
  tickCurrentIndex: number;
  sqrtPrice: bigint;
  liquidity: bigint;
  feeRate: number;
}

/**
 * Get price from Orca Whirlpools DEX
 * @param tokenMint - Token mint address
 * @param quoteMint - Quote token mint (default: USDC)
 * @returns Price data from Orca
 */
export async function getOrcaPrice(
  tokenMint: string,
  quoteMint: string = USDC_MINT
): Promise<DexPrice> {
  try {
    const poolInfo = await fetchOrcaPoolInfo(tokenMint, quoteMint);
    
    if (!poolInfo) {
      throw new Error('Pool not found');
    }

    // Calculate price from sqrt price (Concentrated Liquidity formula)
    const price = calculatePriceFromSqrtPrice(poolInfo.sqrtPrice);
    
    // Convert liquidity to USD terms (approximate)
    const liquidity = Number(poolInfo.liquidity) / 1e6;

    return {
      dex: 'Orca',
      price,
      liquidity,
      fee: poolInfo.feeRate,
      timestamp: Date.now(),
      poolAddress: poolInfo.address,
    };
  } catch (error) {
    console.error('Orca price fetch error:', error);
    throw new Error(`Orca: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch pool info from Orca Whirlpools using direct RPC calls
 * This approach doesn't require wallet setup
 */
async function fetchOrcaPoolInfo(
  tokenMint: string,
  quoteMint: string
): Promise<OrcaPoolInfo | null> {
  try {
    // For now, use a simplified approach
    // We'll derive the PDA and fetch the account data directly
    
    // Common tick spacings to try
    const tickSpacings = [64, 128, 1, 8];
    
    for (const tickSpacing of tickSpacings) {
      try {
        // Derive whirlpool PDA
        const whirlpoolPda = await deriveWhirlpoolPDA(
          tokenMint,
          quoteMint,
          tickSpacing
        );
        
        // Try to fetch account data
        const accountInfo = await connection.getAccountInfo(whirlpoolPda);
        
        if (accountInfo && accountInfo.data) {
          // Parse the whirlpool data
          const poolData = parseWhirlpoolData(accountInfo.data);
          
          if (poolData) {
            return {
              address: whirlpoolPda.toString(),
              tokenA: poolData.tokenMintA,
              tokenB: poolData.tokenMintB,
              tickCurrentIndex: poolData.tickCurrentIndex,
              sqrtPrice: poolData.sqrtPrice,
              liquidity: poolData.liquidity,
              feeRate: poolData.feeRate / 1000000,
            };
          }
        }
      } catch (e) {
        // Try next tick spacing
        continue;
      }
    }
    
    // No pool found with any tick spacing
    return null;
  } catch (error) {
    console.error('Failed to fetch Orca pool info:', error);
    return null;
  }
}

/**
 * Derive Whirlpool PDA address
 */
async function deriveWhirlpoolPDA(
  tokenMintA: string,
  tokenMintB: string,
  tickSpacing: number
): Promise<PublicKey> {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('whirlpool'),
      new PublicKey(tokenMintA).toBuffer(),
      new PublicKey(tokenMintB).toBuffer(),
      Buffer.from([tickSpacing]),
    ],
    new PublicKey(ORCA_WHIRLPOOL_PROGRAM_ID)
  );
  return pda;
}

/**
 * Parse whirlpool account data
 * This is a simplified parser - in production you'd use the SDK
 */
function parseWhirlpoolData(data: Buffer): {
  tokenMintA: string;
  tokenMintB: string;
  tickCurrentIndex: number;
  sqrtPrice: bigint;
  liquidity: bigint;
  feeRate: number;
} | null {
  try {
    // Orca Whirlpool account layout (simplified)
    // This is based on the public Orca Whirlpool program structure
    
    // Skip discriminator (8 bytes)
    let offset = 8;
    
    // Read token mints (32 bytes each)
    const tokenMintA = new PublicKey(data.slice(offset, offset + 32)).toString();
    offset += 32;
    const tokenMintB = new PublicKey(data.slice(offset, offset + 32)).toString();
    offset += 32;
    
    // Skip some fields to get to the important ones
    offset += 40; // Skip tick spacing, fee rate struct, etc.
    
    // Read sqrt price (16 bytes / 128 bits)
    const sqrtPrice = data.readBigUInt64LE(offset);
    offset += 16;
    
    // Read tick current index (4 bytes)
    const tickCurrentIndex = data.readInt32LE(offset);
    offset += 4;
    
    // Skip to liquidity
    offset += 8;
    
    // Read liquidity (16 bytes / 128 bits)
    const liquidity = data.readBigUInt64LE(offset);
    
    // Read fee rate (2 bytes)
    const feeRate = data.readUInt16LE(40); // Fee rate is earlier in the struct
    
    return {
      tokenMintA,
      tokenMintB,
      tickCurrentIndex,
      sqrtPrice,
      liquidity,
      feeRate,
    };
  } catch (error) {
    console.error('Failed to parse whirlpool data:', error);
    return null;
  }
}

/**
 * Calculate price from sqrt price (concentrated liquidity math)
 * Price = (sqrtPrice / 2^64)^2
 */
function calculatePriceFromSqrtPrice(sqrtPrice: bigint): number {
  const Q64 = BigInt(2) ** BigInt(64);
  const price = Number(sqrtPrice) / Number(Q64);
  return price * price;
}

/**
 * Get multiple prices from Orca
 * @param tokenMints - Array of token mint addresses
 * @param quoteMint - Quote token mint (default: USDC)
 */
export async function getOrcaPrices(
  tokenMints: string[],
  quoteMint: string = USDC_MINT
): Promise<Map<string, DexPrice>> {
  const results = new Map<string, DexPrice>();

  await Promise.allSettled(
    tokenMints.map(async (mint) => {
      try {
        const price = await getOrcaPrice(mint, quoteMint);
        results.set(mint, price);
      } catch (error) {
        console.error(`Failed to get Orca price for ${mint}:`, error);
      }
    })
  );

  return results;
}

/**
 * Check if Orca Whirlpools is available and responding
 */
export async function checkOrcaHealth(): Promise<boolean> {
  try {
    const programId = new PublicKey(ORCA_WHIRLPOOL_PROGRAM_ID);
    const accountInfo = await connection.getAccountInfo(programId);
    return accountInfo !== null;
  } catch (error) {
    console.error('Orca health check failed:', error);
    return false;
  }
}