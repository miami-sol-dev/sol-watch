import { NextResponse } from 'next/server';
import { heliusConnection, getNetworkStatus, getPerformanceInfo } from '@/lib/helius/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Fetch network status
    const status = await getNetworkStatus();
    
    // Fetch performance data
    const performance = await getPerformanceInfo();

    return NextResponse.json({
      blockHeight: status.blockHeight,
      slot: status.slot,
      timestamp: status.timestamp,
      performance: performance || undefined,
    });
  } catch (error) {
    console.error('Helius API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch Helius data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}