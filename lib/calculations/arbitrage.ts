import { DexPrice, ArbitrageOpportunity } from '@/types/dex';

// Configuration
const DEFAULT_TRADE_SIZE_USD = 1000; // $1000 default trade size
const MIN_PROFIT_PERCENT = 0.1; // Minimum 0.1% profit to be considered
const MIN_LIQUIDITY_MULTIPLIER = 2; // Pool should have at least 2x trade size
const GAS_COST_USD = 0.50; // Estimated gas cost per transaction (buy + sell)

/**
 * Calculate arbitrage opportunity from DEX prices
 * @param tokenSymbol - Token symbol (e.g., 'SOL')
 * @param tokenMint - Token mint address
 * @param tokenName - Token full name
 * @param prices - Array of DEX prices
 * @param tradeSize - Trade size in USD (default: $1000)
 * @returns Arbitrage opportunity or null if not profitable
 */
export function calculateArbitrage(
  tokenSymbol: string,
  tokenMint: string,
  tokenName: string,
  prices: DexPrice[],
  tradeSize: number = DEFAULT_TRADE_SIZE_USD
): ArbitrageOpportunity | null {
  // Need at least 2 DEXs to compare
  if (prices.length < 2) {
    return null;
  }

  // Sort by price to find cheapest (buy) and most expensive (sell)
  const sorted = [...prices].sort((a, b) => a.price - b.price);
  const buyDex = sorted[0]; // Cheapest
  const sellDex = sorted[sorted.length - 1]; // Most expensive

  // Calculate spread
  const spread = sellDex.price - buyDex.price;
  const spreadPercent = (spread / buyDex.price) * 100;

  // Check minimum liquidity requirements
  const minLiquidity = tradeSize * MIN_LIQUIDITY_MULTIPLIER;
  if (buyDex.liquidity < minLiquidity || sellDex.liquidity < minLiquidity) {
    return null; // Insufficient liquidity
  }

  // Calculate number of tokens we can buy
  const tokenAmount = tradeSize / buyDex.price;

  // Calculate gross profit (before fees)
  const grossProfit = tokenAmount * sellDex.price - tradeSize;

  // Calculate fees
  const buyFee = tradeSize * buyDex.fee;
  const sellFee = (tokenAmount * sellDex.price) * sellDex.fee;
  const totalFees = buyFee + sellFee + GAS_COST_USD;

  // Calculate net profit
  const netProfit = grossProfit - totalFees;
  const profitPercent = (netProfit / tradeSize) * 100;

  // Only return if profitable after all costs
  if (profitPercent < MIN_PROFIT_PERCENT) {
    return null;
  }

  // Determine confidence level based on spread and liquidity
  const confidence = getConfidenceLevel(spreadPercent, buyDex.liquidity, sellDex.liquidity, tradeSize);

  return {
    tokenSymbol,
    tokenMint,
    tokenName,
    buyDex: buyDex.dex,
    buyPrice: buyDex.price,
    buyLiquidity: buyDex.liquidity,
    sellDex: sellDex.dex,
    sellPrice: sellDex.price,
    sellLiquidity: sellDex.liquidity,
    spread,
    spreadPercent,
    estimatedProfit: netProfit,
    estimatedProfitPercent: profitPercent,
    minLiquidity: Math.min(buyDex.liquidity, sellDex.liquidity),
    timestamp: Date.now(),
    confidence,
  };
}

/**
 * Determine confidence level for an arbitrage opportunity
 * @param spreadPercent - Price spread percentage
 * @param buyLiquidity - Liquidity on buy DEX
 * @param sellLiquidity - Liquidity on sell DEX
 * @param tradeSize - Trade size in USD
 * @returns Confidence level
 */
function getConfidenceLevel(
  spreadPercent: number,
  buyLiquidity: number,
  sellLiquidity: number,
  tradeSize: number
): 'high' | 'medium' | 'low' {
  const minLiquidity = Math.min(buyLiquidity, sellLiquidity);
  const liquidityRatio = minLiquidity / tradeSize;

  // High confidence: Large spread and plenty of liquidity
  if (spreadPercent > 1.0 && liquidityRatio > 10) {
    return 'high';
  }

  // Medium confidence: Decent spread and adequate liquidity
  if (spreadPercent > 0.5 && liquidityRatio > 5) {
    return 'medium';
  }

  // Low confidence: Small spread or limited liquidity
  return 'low';
}

/**
 * Calculate potential profit for a specific trade size
 * @param opportunity - Arbitrage opportunity
 * @param customTradeSize - Custom trade size in USD
 * @returns Updated profit and profit percentage
 */
export function calculateProfitForSize(
  opportunity: ArbitrageOpportunity,
  customTradeSize: number
): { profit: number; profitPercent: number } {
  // Calculate tokens to buy
  const tokenAmount = customTradeSize / opportunity.buyPrice;

  // Gross profit
  const grossProfit = tokenAmount * opportunity.sellPrice - customTradeSize;

  // Estimate fees (using original spread to approximate fee rates)
  const estimatedFeeRate = 0.003; // 0.3% average
  const buyFee = customTradeSize * estimatedFeeRate;
  const sellFee = (tokenAmount * opportunity.sellPrice) * estimatedFeeRate;
  const totalFees = buyFee + sellFee + GAS_COST_USD;

  // Net profit
  const profit = grossProfit - totalFees;
  const profitPercent = (profit / customTradeSize) * 100;

  return { profit, profitPercent };
}

/**
 * Sort opportunities by profit potential
 * @param opportunities - Array of arbitrage opportunities
 * @returns Sorted array (highest profit first)
 */
export function sortOpportunitiesByProfit(
  opportunities: ArbitrageOpportunity[]
): ArbitrageOpportunity[] {
  return opportunities.sort((a, b) => b.estimatedProfitPercent - a.estimatedProfitPercent);
}

/**
 * Filter opportunities by minimum profit threshold
 * @param opportunities - Array of arbitrage opportunities
 * @param minProfitPercent - Minimum profit percentage
 * @returns Filtered array
 */
export function filterByMinProfit(
  opportunities: ArbitrageOpportunity[],
  minProfitPercent: number = MIN_PROFIT_PERCENT
): ArbitrageOpportunity[] {
  return opportunities.filter(opp => opp.estimatedProfitPercent >= minProfitPercent);
}

/**
 * Filter opportunities by confidence level
 * @param opportunities - Array of arbitrage opportunities
 * @param minConfidence - Minimum confidence level ('low' | 'medium' | 'high')
 * @returns Filtered array
 */
export function filterByConfidence(
  opportunities: ArbitrageOpportunity[],
  minConfidence: 'low' | 'medium' | 'high' = 'low'
): ArbitrageOpportunity[] {
  const confidenceLevels = { low: 0, medium: 1, high: 2 };
  const minLevel = confidenceLevels[minConfidence];

  return opportunities.filter(opp => {
    const oppLevel = confidenceLevels[opp.confidence];
    return oppLevel >= minLevel;
  });
}