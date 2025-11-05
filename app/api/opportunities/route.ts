import { NextResponse } from 'next/server';
import { scanForOpportunities } from '@/lib/calculations/scanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const tradeSize = Number(searchParams.get('tradeSize')) || 1000;
    const minProfit = Number(searchParams.get('minProfit')) || 0.1;

    console.log(`API: Scanning for opportunities (trade size: $${tradeSize}, min profit: ${minProfit}%)`);

    // Scan for opportunities
    const result = await scanForOpportunities(tradeSize, minProfit);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Opportunity scan error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scan for opportunities',
        opportunities: [],
        totalScanned: 0,
        successfulScans: 0,
        failedScans: 0,
        scanDuration: 0,
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}