/**
 * Format a number as USD currency
 */
export function formatUSD(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  /**
   * Format a number as USD with compact notation (K, M, B)
   */
  export function formatUSDCompact(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  /**
   * Format a number with commas
   */
  export function formatNumber(num: number, decimals: number = 0): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }
  
  /**
   * Format a percentage
   */
  export function formatPercent(num: number, decimals: number = 2): string {
    return `${num >= 0 ? '+' : ''}${num.toFixed(decimals)}%`;
  }
  
  /**
   * Format a timestamp as relative time (e.g., "2 minutes ago")
   */
  export function formatRelativeTime(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
  
  /**
   * Format a timestamp as time (e.g., "2:30 PM")
   */
  export function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  
  /**
   * Format a timestamp as date and time
   */
  export function formatDateTime(timestamp: number): string {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  
  /**
   * Shorten a Solana address or signature
   */
  export function shortenAddress(address: string, chars: number = 4): string {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }
  
  /**
   * Calculate percentage change
   */
  export function calculateChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
  
  /**
   * Get color for positive/negative values
   */
  export function getChangeColor(value: number): string {
    if (value > 0) return '#10B981'; // Green
    if (value < 0) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  }
  
  /**
   * Truncate text with ellipsis
   */
  export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return `${text.slice(0, length)}...`;
  }
  
  /**
   * Generate a random ID
   */
  export function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Debounce function
   */
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Sleep/delay function
   */
  export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }