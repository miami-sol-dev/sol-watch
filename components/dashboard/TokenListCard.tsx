'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { TOKENS } from '@/lib/tokens';
import Tooltip, { TooltipTitle, TooltipSection, TooltipExample } from '@/components/ui/Tooltip';

interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
}

export default function TokenListCard() {
  const [tokens, setTokens] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokenPrices();
    const interval = setInterval(fetchTokenPrices, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchTokenPrices() {
    try {
      setLoading(false);
      
      // Fetch prices from CoinGecko
      const ids = TOKENS.map(t => t.coingeckoId).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );

      if (!response.ok) throw new Error('Failed to fetch prices');

      const data = await response.json();
      
      const formattedTokens: TokenPrice[] = TOKENS.map(token => {
        const priceData = data[token.coingeckoId];
        return {
          symbol: token.symbol,
          name: token.name,
          price: priceData?.usd || 0,
          change24h: priceData?.usd_24h_change || 0,
          marketCap: priceData?.usd_market_cap,
          volume24h: priceData?.usd_24h_vol,
        };
      });

      setTokens(formattedTokens);
      setError(null);
    } catch (err) {
      console.error('Token price fetch error:', err);
      setError('Failed to fetch token prices');
    }
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex items-center gap-3">
          <Coins className="w-6 h-6" style={{ color: '#F94C9B' }} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Token Prices
          </h2>
          <Tooltip
            content={
              <>
                <TooltipTitle>Understanding Token Prices</TooltipTitle>
                <TooltipSection>
                  This shows live prices for popular Solana tokens. These are cryptocurrencies 
                  built on the Solana blockchain, similar to how apps run on iOS or Android.
                </TooltipSection>
                <TooltipSection title="What's a Token?">
                  Tokens are digital assets on the blockchain. Each has different purposes:
                  <br />
                  • <strong>SOL</strong> - Native currency (like dollars for the US)
                  <br />
                  • <strong>USDC</strong> - Stablecoin pegged to $1 USD
                  <br />
                  • <strong>BONK, WIF, JUP</strong> - Various project tokens
                </TooltipSection>
                <TooltipSection title="Data Source">
                  Prices come from CoinGecko, which aggregates data from hundreds of exchanges 
                  worldwide to give you the average market price.
                </TooltipSection>
                <TooltipSection title="Update Frequency">
                  Prices refresh every 30 seconds. This is slower than network stats because 
                  token prices don't fluctuate as rapidly as blockchain data.
                </TooltipSection>
                <TooltipExample>
                  If you're looking for arbitrage opportunities, you'll compare these "average" 
                  prices against specific DEX (decentralized exchange) prices to find discrepancies.
                </TooltipExample>
              </>
            }
            position="bottom"
          />
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Live market data • Updates every 30s
        </p>
      </div>

      <div className="p-6">
        {loading && tokens.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: 'var(--border-default)' }}></div>
                  <div>
                    <div className="h-4 w-16 rounded mb-1" style={{ backgroundColor: 'var(--border-default)' }}></div>
                    <div className="h-3 w-24 rounded" style={{ backgroundColor: 'var(--border-default)' }}></div>
                  </div>
                </div>
                <div className="h-5 w-20 rounded" style={{ backgroundColor: 'var(--border-default)' }}></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={fetchTokenPrices}
              className="mt-4 px-4 py-2 rounded-lg text-sm gradient-miami text-white"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-3 rounded-lg hover:scale-[1.01] transition-transform cursor-pointer"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #F94C9B 0%, #00B8D4 100%)' }}
                  >
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {token.symbol}
                      </span>
                      <Tooltip
                        content={
                          <>
                            <TooltipTitle>{token.name} ({token.symbol})</TooltipTitle>
                            <TooltipSection title="Current Price">
                              ${token.price > 1 ? token.price.toFixed(2) : token.price.toFixed(6)} USD
                              <br />
                              This is the average price across all major exchanges right now.
                            </TooltipSection>
                            <TooltipSection title="24h Change">
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                              <br />
                              {token.change24h >= 0 ? (
                                <>Price increased in the last 24 hours. 🚀</>
                              ) : (
                                <>Price decreased in the last 24 hours. 📉</>
                              )}
                            </TooltipSection>
                            {token.marketCap && (
                              <TooltipSection title="Market Cap">
                                ${(token.marketCap / 1_000_000_000).toFixed(2)}B
                                <br />
                                This is the total value of all {token.symbol} tokens in circulation. 
                                It's calculated by: (Price × Total Supply).
                              </TooltipSection>
                            )}
                            {token.volume24h && (
                              <TooltipSection title="24h Volume">
                                ${(token.volume24h / 1_000_000).toFixed(2)}M
                                <br />
                                This is how much {token.symbol} was traded across all exchanges in 
                                the last 24 hours. Higher volume = more liquidity and easier to buy/sell.
                              </TooltipSection>
                            )}
                            {token.symbol === 'SOL' && (
                              <TooltipExample>
                                SOL is Solana's native token - you need it to pay for transactions 
                                (called "gas fees"). Think of it like stamps for sending mail!
                              </TooltipExample>
                            )}
                            {token.symbol === 'USDC' && (
                              <TooltipExample>
                                USDC is a "stablecoin" - always worth ~$1. It's backed by real USD 
                                in bank accounts, making it perfect for trading without volatility.
                              </TooltipExample>
                            )}
                          </>
                        }
                        position="left"
                      />
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {token.name}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      ${token.price > 1 ? token.price.toFixed(2) : token.price.toFixed(4)}
                    </div>
                    <Tooltip
                      content={
                        <>
                          <TooltipTitle>Price Notation</TooltipTitle>
                          <TooltipSection>
                            Prices are shown differently based on value:
                          </TooltipSection>
                          <TooltipSection title="High Value Tokens ($1+)">
                            Shown with 2 decimals: $143.52
                            <br />
                            These are typically major tokens like SOL, JUP.
                          </TooltipSection>
                          <TooltipSection title="Low Value Tokens (&lt;$1)">
                            Shown with 4-6 decimals: $0.0234
                            <br />
                            More precision needed for smaller priced tokens like BONK, WIF.
                          </TooltipSection>
                          <TooltipExample>
                            A $0.01 change matters a lot more for a $0.02 token (50% change!) 
                            than for a $100 token (0.01% change).
                          </TooltipExample>
                        </>
                      }
                      position="left"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {token.change24h >= 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3" style={{ color: '#10B981' }} />
                        <span style={{ color: '#10B981' }}>
                          +{token.change24h.toFixed(2)}%
                        </span>
                        <Tooltip
                          content={
                            <>
                              <TooltipTitle>Positive 24h Change</TooltipTitle>
                              <TooltipSection>
                                This token's price has increased by {token.change24h.toFixed(2)}% 
                                in the last 24 hours.
                              </TooltipSection>
                              <TooltipSection title="What This Means">
                                • More buyers than sellers recently
                                <br />
                                • Positive market sentiment
                                <br />
                                • Could indicate trending news or adoption
                              </TooltipSection>
                              <TooltipSection title="For Trading">
                                Green doesn't always mean "buy now" - the price could be:
                                <br />
                                • Reaching a peak (might drop soon)
                                <br />
                                • Just getting started (FOMO incoming)
                                <br />
                                • Following overall market trends
                              </TooltipSection>
                              <TooltipExample>
                                If all crypto is up today, this might just be following Bitcoin's 
                                trend rather than {token.symbol}-specific news.
                              </TooltipExample>
                            </>
                          }
                          position="left"
                        />
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3" style={{ color: '#EF4444' }} />
                        <span style={{ color: '#EF4444' }}>
                          {token.change24h.toFixed(2)}%
                        </span>
                        <Tooltip
                          content={
                            <>
                              <TooltipTitle>Negative 24h Change</TooltipTitle>
                              <TooltipSection>
                                This token's price has decreased by {Math.abs(token.change24h).toFixed(2)}% 
                                in the last 24 hours.
                              </TooltipSection>
                              <TooltipSection title="What This Means">
                                • More sellers than buyers recently
                                <br />
                                • Negative market sentiment
                                <br />
                                • Could be profit-taking or FUD (Fear, Uncertainty, Doubt)
                              </TooltipSection>
                              <TooltipSection title="For Trading">
                                Red doesn't always mean "bad deal" - it could be:
                                <br />
                                • A buying opportunity (discount!)
                                <br />
                                • A falling knife (catching it = ouch)
                                <br />
                                • Temporary market-wide correction
                              </TooltipSection>
                              <TooltipExample>
                                Down -2% is normal daily volatility. Down -20%+ might signal 
                                something more significant happening with {token.symbol}.
                              </TooltipExample>
                            </>
                          }
                          position="left"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}