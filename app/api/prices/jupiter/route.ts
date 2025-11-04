import { NextResponse } from 'next/server';
import { TOKENS } from '@/lib/tokens';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');

  if (!ids) {
    return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
  }

  try {
    // Get all CoinGecko IDs
    const coingeckoIds = TOKENS.map(t => t.coingeckoId).join(',');
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const cgData = await response.json();
    
    interface TokenData {
      id: string;
      symbol: string;
      price: number;
      change24h: number;
    }
    
    const data: Record<string, TokenData> = {};
    
    TOKENS.forEach(token => {
      const tokenData = cgData[token.coingeckoId];
      const price = tokenData?.usd;
      const change24h = tokenData?.usd_24h_change;
      
      if (price && token.mint) {
        data[token.mint] = {
          id: token.mint,
          symbol: token.symbol,
          price: price,
          change24h: change24h || 0,
        };
      }
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
}