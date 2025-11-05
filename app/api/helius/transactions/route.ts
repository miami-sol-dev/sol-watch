import { NextResponse } from 'next/server';
import { heliusConnection } from '@/lib/helius/connection';
import { PublicKey } from '@solana/web3.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Get recent signatures from the network
    // We'll fetch transactions from recent blocks
    const signatures = await heliusConnection.getSignaturesForAddress(
      // Using a known active address (Raydium program) to get recent activity
      new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
      { limit: 10 }
    );

    // Parse the transactions to get details
    const transactions = await Promise.all(
      signatures.slice(0, 8).map(async (sig) => {
        try {
          const tx = await heliusConnection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx) return null;

          // Determine transaction type based on instructions
          let type = 'other';
          let amount = 0;

          if (tx.meta && tx.transaction.message.instructions.length > 0) {
            const instruction = tx.transaction.message.instructions[0];
            
            // Check for transfer
            if ('parsed' in instruction && instruction.parsed?.type === 'transfer') {
              type = 'transfer';
              amount = instruction.parsed.info?.lamports 
                ? instruction.parsed.info.lamports / 1e9 
                : 0;
            }
            // Check for swap (typically has multiple instructions)
            else if (tx.transaction.message.instructions.length > 3) {
              type = 'swap';
              // Try to extract swap amount from first transfer
              const transferIx = tx.transaction.message.instructions.find(
                ix => 'parsed' in ix && ix.parsed?.type === 'transfer'
              );
              if (transferIx && 'parsed' in transferIx) {
                amount = transferIx.parsed.info?.lamports 
                  ? transferIx.parsed.info.lamports / 1e9 
                  : 0;
              }
            }
          }

          return {
            signature: sig.signature,
            slot: sig.slot,
            timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            type,
            amount: amount > 0 ? amount : undefined,
            success: tx.meta?.err === null,
          };
        } catch (err) {
          console.error('Error parsing transaction:', err);
          return null;
        }
      })
    );

    // Filter out null results and return
    const validTransactions = transactions.filter(tx => tx !== null);

    return NextResponse.json({
      transactions: validTransactions,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Transactions API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch transactions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}