import { TOKENS } from '../tokens';
import { fetchAllDexPrices } from '../dex/aggregator';
import { calculateArbitrage, sortOpportunitiesByProfit } from './arbitrage';
import { ArbitrageOpportunity } from '@/types/dex';

interface ScanResult {
  opportunities: ArbitrageOpportunity[];
  totalScanned: number;
  successfulScans: number;
  failedScans: number;
  scanDuration: number;
  timestamp: number;
}

/**
 * Scan all configured tokens for arbitrage opportunities
 * @param tradeSize - Trade size in USD (default: $1000)
 * @param minProfitPercent - Minimum profit percentage to return (default: 0.1%)
 * @returns Scan results with found opportunities
 */
export async function scanForOpportunities(
  tradeSize: number = 1000,
  minProfitPercent: number = 0.1
): Promise<ScanResult> {
  const startTime = Date.now();
  const opportunities: ArbitrageOpportunity[] = [];
  let successfulScans = 0;
  let failedScans = 0;

  console.log(`Starting scan of ${TOKENS.length} tokens...`);

  // Scan all tokens in parallel for speed
  await Promise.all(
    TOKENS.map(async (token) => {
      try {
        // Skip if token doesn't have a mint address
        if (!token.mint) {
          console.warn(`Token ${token.symbol} has no mint address, skipping`);
          failedScans++;
          return;
        }

        // Fetch prices from all DEXs
        const { prices, errors } = await fetchAllDexPrices(token.mint);

        // Log any errors but continue
        if (errors.length > 0) {
          console.warn(`Errors fetching ${token.symbol} prices:`, errors);
        }

        // Need at least 2 prices to find arbitrage
        if (prices.length < 2) {
          console.warn(`⚠️ Only ${prices.length} price source for ${token.symbol} - need 2+ for arbitrage detection`);
          console.log(`   Current price from ${prices[0]?.dex}: $${prices[0]?.price.toFixed(4) || 'N/A'}`);
          failedScans++;
          return;
        }

        // Calculate arbitrage opportunity
        const opportunity = calculateArbitrage(
          token.symbol,
          token.mint,
          token.name,
          prices,
          tradeSize
        );

        // Only add if profitable above threshold
        if (opportunity && opportunity.estimatedProfitPercent >= minProfitPercent) {
          opportunities.push(opportunity);
          console.log(
            `✅ Found opportunity: ${token.symbol} - ` +
            `${opportunity.estimatedProfitPercent.toFixed(2)}% profit ` +
            `(${opportunity.buyDex} → ${opportunity.sellDex})`
          );
        }

        successfulScans++;
      } catch (error) {
        console.error(`Failed to scan ${token.symbol}:`, error);
        failedScans++;
      }
    })
  );

  // Sort opportunities by profit (highest first)
  const sortedOpportunities = sortOpportunitiesByProfit(opportunities);

  const scanDuration = Date.now() - startTime;

  console.log(
    `Scan complete: Found ${sortedOpportunities.length} opportunities ` +
    `in ${scanDuration}ms (${successfulScans} success, ${failedScans} failed)`
  );

  return {
    opportunities: sortedOpportunities,
    totalScanned: TOKENS.length,
    successfulScans,
    failedScans,
    scanDuration,
    timestamp: Date.now(),
  };
}

/**
 * Scan a single token for arbitrage opportunities
 * @param tokenMint - Token mint address
 * @param tokenSymbol - Token symbol
 * @param tokenName - Token name
 * @param tradeSize - Trade size in USD
 * @returns Opportunity or null
 */
export async function scanSingleToken(
  tokenMint: string,
  tokenSymbol: string,
  tokenName: string,
  tradeSize: number = 1000
): Promise<ArbitrageOpportunity | null> {
  try {
    const { prices, errors } = await fetchAllDexPrices(tokenMint);

    if (errors.length > 0) {
      console.warn(`Errors fetching ${tokenSymbol} prices:`, errors);
    }

    if (prices.length < 2) {
      return null;
    }

    return calculateArbitrage(tokenSymbol, tokenMint, tokenName, prices, tradeSize);
  } catch (error) {
    console.error(`Failed to scan ${tokenSymbol}:`, error);
    return null;
  }
}

/**
 * Monitor for opportunities continuously
 * @param callback - Function to call when opportunities are found
 * @param intervalMs - Scan interval in milliseconds (default: 30s)
 * @param tradeSize - Trade size in USD
 */
export function startContinuousScanning(
  callback: (result: ScanResult) => void,
  intervalMs: number = 30000,
  tradeSize: number = 1000
): () => void {
  console.log(`Starting continuous scanning every ${intervalMs}ms`);

  // Initial scan
  scanForOpportunities(tradeSize).then(callback);

  // Periodic scans
  const intervalId = setInterval(async () => {
    const result = await scanForOpportunities(tradeSize);
    callback(result);
  }, intervalMs);

  // Return cleanup function
  return () => {
    console.log('Stopping continuous scanning');
    clearInterval(intervalId);
  };
}